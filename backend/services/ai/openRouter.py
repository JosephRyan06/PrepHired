import os
import json

from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is missing")


OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)


app = FastAPI(
    title="PrepHired",
    description="AI service for generating professional resume",
    version="1.0.0"
)

class ImportResumeRequest(BaseModel):
    extractedText: str


@app.post("/parse-resume")
async def parse_resume(data: ImportResumeRequest):
    try:
        extracted_text = data.extractedText.strip()

        if not extracted_text:
            raise HTTPException(
                status_code=400,
                detail="Resume text is required",
            )

        prompt = f"""
You are an expert resume information extraction system.

Extract resume information ONLY from the supplied resume text.

Do not invent missing information, skills, dates, qualifications,
work experience, achievements, metrics, projects, or certifications.

Return ONLY valid JSON using exactly this structure:

{{
    "basicInfo": {{
        "fullName": "",
        "contactNumber": "",
        "address": "",
        "email": "",
        "linkedInURL": "",
        "portfolioLink": ""
    }},
    "targetJob": {{
        "jobTitle": "",
        "industry": "",
        "jobDescription": ""
    }},
    "workExperiences": [
        {{
            "jobTitle": "",
            "company": "",
            "location": "",
            "periodOfEmployment": "",
            "currentlyWorking": false,
            "description": ""
        }}
    ],
    "educations": [
        {{
            "school": "",
            "degreeField": "",
            "location": "",
            "schoolYear": "",
            "description": ""
        }}
    ],
    "professionalSummary": "",
    "skills": "",
    "projects": [
        {{
            "projectName": "",
            "projectDescription": ""
        }}
    ],
    "certificates": ""
}}

    Rules:

    Use empty strings for unknown text fields.
    Use empty arrays when no entries exist.
    Use false for currentlyWorking unless current employment is explicitly supported by the resume.
    Extract targetJob.jobTitle from an explicitly stated desired position, career objective, or professional summary.
    If the resume explicitly states that the applicant is seeking, pursuing, or applying for a particular role, use that role as targetJob.jobTitle.
    If a job title appears directly below the applicant's name, consider it a potential target job title. Use the professional summary and surrounding text to determine whether it represents the desired position.
    For example, if the resume lists "Junior Developer" below the applicant's name and the professional summary says "seeking a Junior Developer role", set targetJob.jobTitle to "Junior Developer".
    Do not automatically treat a previous or current work experience job title as the target job.
    Extract targetJob.industry only when supported by the resume. You may use clearly stated career goals and relevant context to identify the industry, but do not invent details.
    Extract targetJob.jobDescription only when the resume explicitly provides a description of the desired role. Otherwise, use an empty string.
    Do not confuse targetJob.jobTitle with basicInfo.fullName or any other field.
    Preserve the meaning of dates and qualifications.
    Do not invent IDs; the backend will generate them.
    Extract skills as a readable, comma-separated string.
    Extract certificates as a readable string.
    Do not include analysis or optimization.
    Do not include Markdown or code fences.

RESUME TEXT:
{json.dumps(extracted_text, ensure_ascii=False)}
"""

        response = client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        if not response.choices[0].message.content:
            raise HTTPException(
                status_code=500,
                detail="OpenRouter returned an empty response",
            )

        result_text = response.choices[0].message.content.strip()

        if result_text.startswith("```json"):
            result_text = result_text[7:]
        elif result_text.startswith("```"):
            result_text = result_text[3:]

        if result_text.endswith("```"):
            result_text = result_text[:-3]

        result_text = result_text.strip()

        try:
            parsed_resume = json.loads(result_text)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="OpenRouter returned invalid resume JSON",
            )

        if not isinstance(parsed_resume, dict):
            raise HTTPException(
                status_code=500,
                detail="Invalid resume data format",
            )

        required_fields = [
            "basicInfo",
            "targetJob",
            "workExperiences",
            "educations",
            "professionalSummary",
            "skills",
            "projects",
            "certificates",
        ]

        if any(key not in parsed_resume for key in required_fields):
            raise HTTPException(
                status_code=500,
                detail="Parsed resume is missing required fields",
            )

        return {
            "success": True,
            "resume": parsed_resume,
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Resume parsing error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to parse uploaded resume",
        )

class ResumeRequest(BaseModel):

    basicInfo: dict = Field(default_factory=dict)

    targetJob: dict = Field(default_factory=dict)

    professionalSummary: str = ""

    workExperiences: list = Field(
        default_factory=list
    )

    educations: list = Field(
        default_factory=list
    )

    skills: str = ""

    projects: list = Field(
        default_factory=list
    )

    certificates: str = ""

    aiAnalysis: dict = Field(
        default_factory=dict
    )

# GENERATE PROFESSIONAL SUMMARY
@app.post("/generate-summary")
async def generate_summary(data: ResumeRequest):

    try:

        target_job = json.dumps(
            data.targetJob,
            indent=2,
            ensure_ascii=False
        )

        work_experiences = json.dumps(
            data.workExperiences,
            indent=2,
            ensure_ascii=False
        )

        educations = json.dumps(
            data.educations,
            indent=2,
            ensure_ascii=False
        )

        projects = json.dumps(
            data.projects,
            indent=2,
            ensure_ascii=False
        )

        certificates = json.dumps(
            data.certificates,
            indent=2,
            ensure_ascii=False
        )

        skills = data.skills.strip()


        prompt = f"""
        You are an expert professional resume writer.

        Your task is to write an ATS-friendly professional summary for the
        applicant based ONLY on the information provided below.

        Do not invent, assume, exaggerate, or fabricate any information.

        ========================================
        TARGET JOB
        ========================================

        {target_job}

        ========================================
        WORK EXPERIENCE
        ========================================

        {work_experiences}

        ========================================
        EDUCATION
        ========================================

        {educations}

        ========================================
        SKILLS
        ========================================

        {skills}

        ========================================
        PROJECTS
        ========================================

        {projects}

        ========================================
        CERTIFICATES
        ========================================

        {certificates}

        ========================================
        EDUCATION INTERPRETATION
        ========================================

        When interpreting education:

        - If the education end year is earlier than the current year,
          consider the applicant graduated unless the data explicitly
          states that the applicant is still studying.

        - If the education end year is the current year, consider the
          applicant graduated/completed unless the data explicitly states
          that the applicant is still studying.

        - If the education end year is later than the current year,
          consider the applicant currently studying.

        - If the education says "Present", consider the applicant
          currently studying.

        - Never invent a graduation date.

        - Never change the education dates provided by the applicant.

        ========================================
        SUMMARY REQUIREMENTS
        ========================================

        1. Write approximately 3-4 sentences.

        2. Tailor the summary specifically to the target job.

        3. Use relevant keywords from the target job description only when
           those keywords accurately match the applicant's actual
           information.

        4. Highlight relevant skills.

        5. Highlight relevant education when applicable.

        6. Highlight relevant work experience when applicable.

        7. Highlight relevant projects when applicable.

        8. Mention certifications when relevant and provided.

        9. If the applicant has little or no work experience, focus on:

        - education
        - relevant skills
        - projects
        - certifications

        10. If the applicant is a student, do not describe them as a
            graduate unless the education information indicates that they
            have graduated.

        11. If the applicant has graduated, you may describe them as a
            graduate when relevant to the target job.

        12. Use professional language.

        13. Make the summary ATS-friendly.

        14. Use natural keywords.

        15. Do not keyword-stuff.

        ========================================
        STRICT TRUTHFULNESS RULES
        ========================================

        Do NOT invent:

        - work experience
        - years of experience
        - skills
        - technologies
        - programming languages
        - tools
        - certifications
        - qualifications
        - achievements
        - awards
        - metrics
        - percentages
        - projects
        - clients
        - responsibilities
        - job titles
        - companies

        Do not claim proficiency in technologies that were not provided.

        Do not claim achievements that were not provided.

        Do not create fake numbers or statistics.

        Do not exaggerate the applicant's qualifications.

        If a field is empty, simply ignore it.

        ========================================
        WRITING STYLE
        ========================================

        - Use third person or professional resume language.
        - Do not use "I", "me", or "my".
        - Do not use "I am".
        - Do not use "I have".
        - Do not use "my experience".
        - Do not use "my skills".

        Avoid generic filler such as:

        "hardworking"
        "highly motivated"
        "passionate"
        "team player"

        unless clearly supported by the applicant's information.

        Use concise, professional, specific language.

        ========================================
        OUTPUT
        ========================================

        Return ONLY the professional summary.

        Do not return:

        - headings
        - labels
        - bullet points
        - explanations
        - analysis
        - quotation marks
        - JSON
        """


        response = client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )


        if not response.choices[0].message.content:
            raise HTTPException(
                status_code=500,
                detail="OpenRouter returned an empty response"
            )


        summary = response.choices[0].message.content.strip()


        if (
            summary.startswith('"')
            and summary.endswith('"')
        ):
            summary = summary[1:-1].strip()


        return {
            "success": True,
            "summary": summary
        }


    except HTTPException:
        raise


    except Exception as error:

        print(
            "OpenRouter error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate professional summary"
        )

@app.post("/analyze-resume")
async def analyze_resume(data: ResumeRequest):

    try:

        def has_content(value):
            if value is None:
                return False

            if isinstance(value, str):
                return bool(value.strip())

            if isinstance(value, list):
                return any(has_content(item) for item in value)

            if isinstance(value, dict):
                return any(has_content(v) for v in value.values())

            return True

        has_target_job = has_content(data.targetJob)
        has_work_experience = has_content(data.workExperiences)
        has_education = has_content(data.educations)
        has_skills = has_content(data.skills)
        has_projects = has_content(data.projects)
        has_certificates = has_content(data.certificates)

        target_job = (
            json.dumps(
                data.targetJob,
                ensure_ascii=False
            )
            if has_target_job
            else ""
        )

        work_experiences = (
            json.dumps(
                data.workExperiences,
                ensure_ascii=False
            )
            if has_work_experience
            else ""
        )

        educations = (
            json.dumps(
                data.educations,
                ensure_ascii=False
            )
            if has_education
            else ""
        )

        projects = (
            json.dumps(
                data.projects,
                ensure_ascii=False
            )
            if has_projects
            else ""
        )

        certificates = (
            data.certificates.strip()
            if has_certificates
            else ""
        )

        skills = (
            data.skills.strip()
            if has_skills
            else ""
        )

        prompt = f"""
        You are an expert ATS resume analyst.

        Analyze the resume ONLY using information provided by the applicant.
        Never invent skills, experience, certifications, achievements,
        qualifications, numbers, or keywords.

        Target Job:
        {target_job or "Not provided"}

        Work Experience:
        {work_experiences or "Not provided"}

        Education:
        {educations or "Not provided"}

        Skills:
        {skills or "Not provided"}

        Projects:
        {projects or "Not provided"}

        Certificates:
        {certificates or "Not provided"}

        ==================================================
        ATS SCORE
        ==================================================

        Give an ATS score from 0-100 based on relevance to the target job.

        Consider:

        - Keyword matching: 30%
        - Skills: 20%
        - Experience: 20%
        - Education: 10%
        - Projects: 10%
        - Certifications: 5%
        - Clarity and ATS readability: 5%

        Rules:

        - Score ONLY information actually provided.
        - Empty sections must NOT lower the score.
        - Empty sections must NOT be called weaknesses.
        - Redistribute the weight of empty sections to sections containing
        information.
        - If there is no work experience, do NOT penalize the applicant.
        - For applicants without work experience, focus on education, skills,
        projects, certifications, and other relevant information.
        - Matching keywords must be supported by the resume.
        - Missing keywords must be relevant target-job keywords not supported
        by the resume.
        - Never invent or assume skills, technologies, experience,
        certifications, achievements, metrics, or qualifications.
        - Recommendations must only suggest truthful improvements.
        - Score must be an integer from 0 to 100.

        ==================================================
        SECTION ANALYSIS
        ==================================================

        Analyze only sections that contain information.

        For empty sections:

        - Return an empty analysis string.
        - Do not call the section a weakness.
        - Do not include it in recommendations.

        Analyze:

        - Work experience
        - Education
        - Skills
        - Projects
        - Certificates

        ==================================================
        KEYWORDS
        ==================================================

        matchingKeywords:
        Target-job keywords supported by the applicant's resume.

        missingKeywords:
        Relevant target-job keywords not supported by the applicant's resume.

        Never add unsupported keywords to matchingKeywords.

        ==================================================
        STRENGTHS
        ==================================================

        List only genuine strengths supported by the resume.

        ==================================================
        RECOMMENDATIONS
        ==================================================

        Give useful recommendations for improving the existing resume.
        Never recommend fabricating information.

        ==================================================
        OUTPUT
        ==================================================

        Return ONLY valid JSON:

        {{
            "atsScore": 0,
            "strengths": [],
            "missingKeywords": [],
            "matchingKeywords": [],
            "recommendations": [],
            "experienceAnalysis": "",
            "educationAnalysis": "",
            "skillsAnalysis": "",
            "projectAnalysis": "",
            "certificateAnalysis": ""
        }}
        """

        response = client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )

        if not response.choices[0].message.content:
            raise HTTPException(
                status_code=500,
                detail="OpenRouter returned an empty response"
            )

        result_text = response.choices[0].message.content.strip()

        # Remove markdown code fences if OpenRouter adds them
        if result_text.startswith("```json"):
            result_text = result_text[7:]

        elif result_text.startswith("```"):
            result_text = result_text[3:]

        if result_text.endswith("```"):
            result_text = result_text[:-3]

        result_text = result_text.strip()

        try:
            analysis = json.loads(result_text)

        except json.JSONDecodeError:
            print("Invalid OpenRouter JSON:", result_text)

            raise HTTPException(
                status_code=500,
                detail="OpenRouter returned invalid analysis format"
            )

        # Make sure empty optional sections stay empty
        if not has_work_experience:
            analysis["experienceAnalysis"] = ""

        if not has_education:
            analysis["educationAnalysis"] = ""

        if not has_skills:
            analysis["skillsAnalysis"] = ""

        if not has_projects:
            analysis["projectAnalysis"] = ""

        if not has_certificates:
            analysis["certificateAnalysis"] = ""

        # Validate output
        if not isinstance(analysis.get("atsScore"), (int, float)):
            analysis["atsScore"] = 0

        if not isinstance(analysis.get("strengths"), list):
            analysis["strengths"] = []

        if not isinstance(analysis.get("missingKeywords"), list):
            analysis["missingKeywords"] = []

        if not isinstance(analysis.get("matchingKeywords"), list):
            analysis["matchingKeywords"] = []

        if not isinstance(analysis.get("recommendations"), list):
            analysis["recommendations"] = []

        analysis["atsScore"] = max(
            0,
            min(100, int(analysis["atsScore"]))
        )

        return {
            "success": True,
            "analysis": analysis
        }

    except HTTPException:
        raise

    except Exception as error:
        print("AI analysis error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze resume"
        )

# OPTIMIZE RESUME
@app.post("/optimize-resume")
async def optimize_resume(data: ResumeRequest):

    try:

        current_year = datetime.now().year

        basic_info = json.dumps(
            data.basicInfo,
            indent=2,
            ensure_ascii=False
        )

        target_job = json.dumps(
            data.targetJob,
            indent=2,
            ensure_ascii=False
        )

        work_experiences = json.dumps(
            data.workExperiences,
            indent=2,
            ensure_ascii=False
        )

        educations = json.dumps(
            data.educations,
            indent=2,
            ensure_ascii=False
        )

        projects = json.dumps(
            data.projects,
            indent=2,
            ensure_ascii=False
        )

        certificates = data.certificates.strip()

        skills = data.skills.strip()

        professional_summary = (
            data.professionalSummary.strip()
        )

        ai_analysis = json.dumps(
            data.aiAnalysis,
            indent=2,
            ensure_ascii=False
        )

        # ----------------------------------------------------
        # ORIGINAL ATS SCORE
        # ----------------------------------------------------

        original_ats_score = data.aiAnalysis.get(
            "atsScore",
            0
        )


        prompt = f"""
        You are an expert ATS resume optimizer, professional resume writer,
        recruiter, and career-document specialist.

        Optimize the applicant's resume for the TARGET JOB.

        The most important requirements are:

        1. Use ONLY information provided by the applicant.
        2. Never invent, assume, fabricate, exaggerate, or infer unsupported facts.
        3. Improve ATS compatibility, relevance, clarity, grammar, consistency,
        formatting, and professional presentation.
        4. Preserve the applicant's factual information.
        5. Return ONLY valid JSON using the exact structure provided below.

        ==================================================
        CURRENT YEAR
        ==================================================

        {current_year}

        ORIGINAL ATS SCORE:
        {original_ats_score}

        ==================================================
        RESUME DATA
        ==================================================

        BASIC INFORMATION:
        {basic_info}

        TARGET JOB:
        {target_job}

        WORK EXPERIENCES:
        {work_experiences}

        EDUCATION:
        {educations}

        SKILLS:
        {skills}

        PROJECTS:
        {projects}

        CERTIFICATES:
        {certificates}

        PROFESSIONAL SUMMARY:
        {professional_summary}

        PREVIOUS AI ANALYSIS:
        {ai_analysis}

        ==================================================
        CORE TRUTHFULNESS RULE
        ==================================================

        Use only information supplied by the applicant.

        NEVER invent:

        - work experience
        - job titles
        - companies
        - employment dates
        - responsibilities
        - skills
        - technologies
        - programming languages
        - frameworks
        - tools
        - certifications
        - degrees
        - schools
        - projects
        - clients
        - achievements
        - awards
        - metrics
        - percentages
        - qualifications
        - leadership experience
        - management experience
        - locations
        - addresses
        - names
        - years of experience

        Never turn an assumption into a factual claim.

        Do not add unsupported keywords merely because they appear in the
        target job description.

        ==================================================
        PRESERVE ORIGINAL DATA
        ==================================================

        Preserve existing IDs exactly.

        Preserve the original meaning and factual information of:

        - names
        - job titles
        - companies
        - dates
        - locations
        - schools
        - degrees
        - education years
        - projects
        - certificates
        - skills

        Original values must not be modified in the database.

        Optimized values are returned separately.

        Do not create new:

        - work experiences
        - education entries
        - projects
        - certificates

        Ignore completely empty entries.

        If workExperiences is empty, do not create a Work Experience section.

        ==================================================
        NAME AND PROPER-NAME FORMATTING
        ==================================================

        Professionally normalize capitalization without changing spelling,
        order, identity, or meaning.

        Examples:

        "juan dela cruz" → "Juan Dela Cruz"
        "university of the philippines" → "University of the Philippines"
        "sample company" → "Sample Company"
        "BS INFORMATION TECHNOLOGY" → "BS Information Technology"
        "online resume builder" → "Online Resume Builder"

        Preserve technical terms and acronyms such as:

        React Native
        Node.js
        MongoDB
        JavaScript
        Python
        FastAPI
        Express.js
        SQL
        HTML
        CSS
        API
        AI
        AWS
        IBM
        UP
        BSIT
        BSCS
        MBA
        PhD

        Do not invent official names or information.

        ==================================================
        ADDRESS OPTIMIZATION
        ==================================================

        Use ONLY:

        basicInfo.address

        Return the exact provided address in:

        address.original

        If an address exists, normalize it into a concise:

        City, Country

        format when the city and country are clearly supported.

        For Philippine addresses use:

        City, Philippines

        Examples:

        "Dagupan City"
        → "Dagupan, Philippines"

        "Brgy. Pantal, Dagupan City, Pangasinan"
        → "Dagupan, Philippines"

        "Makati City, Metro Manila"
        → "Makati, Philippines"

        "Quezon City"
        → "Quezon City, Philippines"

        "Calasiao, Pangasinan"
        → "Calasiao, Philippines"

        "123 Main Street, New York, USA"
        → "New York, USA"

        Do not infer a city from:

        - company
        - school
        - work location
        - education location
        - current location
        - outside information

        Never use the applicant's current location.

        Remove unnecessary street, barangay, subdivision, district, or province
        details only when the city is clearly known.

        If the address cannot be reliably normalized, preserve it.

        If address is empty:

        address.original = ""
        address.optimized = ""

        ==================================================
        WORK AND EDUCATION LOCATIONS
        ==================================================

        For every existing work and education location:

        - Use ONLY the provided location.
        - Preserve the original location.
        - Return the optimized location separately.
        - Prefer City, Country.
        - For Philippine locations use City, Philippines.
        - Remove unnecessary local details when the city is clearly known.
        - Never guess or infer a location.
        - Never use the applicant's current location.
        - If the location is empty, optimized location must remain empty.

        Examples:

        "Brgy. Pantal, Dagupan City, Pangasinan"
        → "Dagupan, Philippines"

        "Calasiao, Pangasinan"
        → "Calasiao, Philippines"

        "Makati City, Metro Manila"
        → "Makati, Philippines"

        ==================================================
        PROFESSIONAL SUMMARY
        ==================================================

        Optimize the existing summary.

        Improve:

        - clarity
        - grammar
        - ATS relevance
        - target-job alignment
        - professional wording
        - supported keyword usage

        Keep it concise.

        If empty, create a summary using only the applicant's actual:

        - education
        - skills
        - projects
        - certifications
        - experience

        Never invent years of experience, qualifications, achievements,
        skills, or responsibilities.

        ==================================================
        WORK EXPERIENCE
        ==================================================

        For every valid existing work experience:

        - Preserve ID.
        - Preserve job title.
        - Preserve company.
        - Preserve employment period.
        - Preserve original location.
        - Return optimized location separately.
        - Improve the description.
        - Improve grammar and clarity.
        - Improve ATS relevance.

        Descriptions must use bullet points.

        Every bullet must start with:

        •

        Use:

        ACTION → RESPONSIBILITY → RESULT

        only when the result is actually supported.

        If no result is provided, use:

        ACTION → RESPONSIBILITY

        Never invent:

        - achievements
        - metrics
        - percentages
        - technologies
        - tools
        - clients
        - projects
        - results
        - business impact

        If job title exists but description is empty, generic responsibilities may
        be generated based only on the job title.

        Generic responsibilities must NOT contain invented:

        - achievements
        - metrics
        - technologies
        - projects
        - clients
        - results

        If only a company exists:

        - preserve the company
        - do not invent a job title
        - do not invent responsibilities

        If only a job title exists:

        - preserve the job title
        - generic responsibilities may be generated
        - do not invent company
        - do not invent dates
        - do not invent achievements

        Do not duplicate experiences.

        ==================================================
        EDUCATION
        ==================================================

        Preserve:

        - original ID
        - school
        - degreeField
        - location
        - schoolYear
        - description

        Normalize capitalization only.

        Do not invent:

        - graduation dates
        - GPA
        - honors
        - awards
        - coursework
        - academic achievements

        Education year rules:

        If end year < {current_year}:
        consider completed unless explicitly stated otherwise.

        If end year = {current_year}:
        consider completed unless explicitly stated that the applicant is still studying.

        If end year > {current_year}:
        consider currently studying.

        If the education says "Present":
        consider currently studying.

        Never invent missing dates.

        ==================================================
        SKILLS
        ==================================================

        Optimize skills for ATS readability.

        - Preserve applicant-provided skills.
        - Remove duplicates.
        - Normalize names when meaning is clear.
        - Prioritize relevant supported skills.
        - Never add unsupported skills.
        - Do not claim proficiency levels unless provided.

        Examples:

        React JS → React.js
        Node → Node.js
        Mongo → MongoDB
        react native → React Native
        javascript → JavaScript
        fastapi → FastAPI

        Never convert a skill into an unsupported claim such as:

        "Expert React.js Developer"

        unless explicitly provided.

        ==================================================
        PROJECTS
        ==================================================

        For every existing project:

        - Preserve the original ID.
        - Preserve the project name exactly as entered, including capitalization.
        - Improve the project description for grammar, clarity, professionalism, and ATS relevance.
        - Preserve the original meaning.
        - Use bullet points when appropriate.
        - Do not create new projects.

        IMPORTANT:

        - Optimize ONLY the existing project description.
        - NEVER use the project name as the description.
        - NEVER invent technologies, tools, clients, users, metrics, achievements, results, or responsibilities.
        - If the project description is empty, null, or missing, return an empty "optimized" value.
        - If the description is empty, DO NOT generate or infer a description from the project name.
        - Preserve the same number of projects and their IDs.

        If there are no projects, return an empty projects array.


        ==================================================
        CERTIFICATES
        ==================================================

        Preserve certificates provided by the applicant.

        Normalize certificate names professionally.

        Do not invent:

        - certifications
        - issuers
        - dates
        - credential IDs
        - expiration dates
        - certification levels

        If there are no certificates, do not create fake certificates.

        ==================================================
        ATS KEYWORD OPTIMIZATION
        ==================================================

        Analyze the target job.

        Identify:

        1. MATCHING KEYWORDS
        Keywords from the target job already supported by the applicant.

        2. MISSING KEYWORDS
        Important target-job keywords not supported by the applicant.

        Use supported keywords naturally in the optimized resume.

        Never insert unsupported keywords.

        Never keyword-stuff.

        ==================================================
        ATS FORMATTING
        ==================================================

        Keep the content ATS-friendly.

        Prefer:

        - standard section names
        - clear text
        - concise bullet points
        - consistent terminology
        - standard dates
        - professional capitalization
        - simple formatting

        Use standard sections such as:

        Professional Summary
        Work Experience
        Education
        Skills
        Projects
        Certifications

        Avoid:

        - emojis
        - decorative symbols
        - tables
        - columns
        - graphics
        - icons
        - text boxes
        - unusual section names
        - keyword stuffing

        ==================================================
        ATS SCORE
        ==================================================

        The original ATS score is {original_ats_score}.

        The optimized resume is an improved version of the original resume.

        - The optimized score must NEVER be lower than the original score.
        - Use the original score as the baseline.
        - Increase the score only for truthful improvements.
        - Improvements may include better keyword alignment, clarity, grammar,
        ATS readability, summary, skills, experience, education, projects,
        or certifications.
        - Never increase the score because of invented or unsupported information.
        - If there is no meaningful improvement, keep the original score.

        optimizedScore >= originalScore


        ==================================================
        ANALYSIS
        ==================================================

        Return:

        - strengths
        - missingKeywords
        - matchingKeywords
        - recommendations
        - experienceAnalysis
        - educationAnalysis
        - skillsAnalysis
        - projectAnalysis
        - certificateAnalysis

        Only report information supported by the applicant.

        Recommendations must never suggest fabricating information.

        ==================================================
        CHANGES
        ==================================================

        List only meaningful changes actually made.

        Possible examples:

        - Improved professional summary.
        - Improved work experience descriptions.
        - Standardized skill names.
        - Improved project descriptions.
        - Improved keyword alignment.
        - Removed redundant wording.
        - Standardized name capitalization.
        - Standardized school capitalization.
        - Standardized company capitalization.
        - Standardized degree formatting.
        - Standardized certificate formatting.
        - Standardized address formatting.
        - Standardized work locations.
        - Standardized education locations.

        Do not report a change that was not actually made.

        ==================================================
        FINAL VALIDATION
        ==================================================

        Before returning JSON, verify:

        1. No fabricated information.
        2. No unsupported keywords.
        3. No fake experience.
        4. No fake skills.
        5. No fake certifications.
        6. No fake education.
        7. No fake projects.
        8. No fake achievements.
        9. No fake metrics.
        10. No unsupported technologies.
        11. Existing IDs are preserved.
        12. Existing job titles are preserved.
        13. Existing companies are preserved.
        14. Existing education information is preserved.
        15. Existing project names are preserved.
        16. Empty experiences are ignored.
        17. No Work Experience section is created when none exists.
        18. Work descriptions use bullet points.
        19. Keywords are natural.
        20. Resume remains truthful.
        21. ATS score reflects the final resume.
        22. Address is formatted only when reliable.
        23. Names are professionally capitalized.
        24. Schools are professionally capitalized.
        25. Companies are professionally capitalized.
        26. Degrees are professionally capitalized.
        27. Projects are professionally capitalized.
        28. Certificates are professionally capitalized.
        29. Technical terms and acronyms are preserved.
        30. Work locations are based only on provided values.
        31. Education locations are based only on provided values.
        32. No location was guessed.
        33. Current-location information was not used.
        34. Original values remain unchanged.

        ==================================================
        OUTPUT
        ==================================================

        Return ONLY valid JSON.

        Do NOT use markdown.

        Do NOT use code fences.

        Do NOT include explanations outside the JSON.

        Use EXACTLY this structure:

        {{
            "address": {{
                "original": "",
                "optimized": "",
                "reason": ""
            }},

            "professionalSummary": {{
                "original": "",
                "optimized": "",
                "reason": ""
            }},

            "workExperiences": [
                {{
                    "id": "",
                    "jobTitle": "",
                    "company": "",
                    "location": "",
                    "periodOfEmployment": "",
                    "description": "",
                    "reason": ""
                }}
            ],

            "educations": [
                {{
                    "id": "",
                    "school": "",
                    "degreeField": "",
                    "location": "",
                    "schoolYear": "",
                    "description": "",
                    "reason": ""
                }}
            ],

            "skills": {{
                "original": "",
                "optimized": "",
                "reason": ""
            }},

            "projects": [
                {{
                    "id": "",
                    "projectName": "",
                    "projectDescription": "",
                    "reason": ""
                }}
            ],

            "certificates": {{
                "original": "",
                "optimized": "",
                "reason": ""
            }},

            "changes": [],

            "optimizedAnalysis": {{
                "atsScore": 0,
                "strengths": [],
                "missingKeywords": [],
                "matchingKeywords": [],
                "recommendations": [],
                "experienceAnalysis": "",
                "educationAnalysis": "",
                "skillsAnalysis": "",
                "projectAnalysis": "",
                "certificateAnalysis": ""
            }}
        }}
        """

        response = client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )

        if not response.choices[0].message.content:

            raise HTTPException(
                status_code=500,
                detail="OpenRouter returned an empty response"
            )

        result_text = response.choices[0].message.content.strip()

        if result_text.startswith("```json"):

            result_text = result_text[7:]

        if result_text.startswith("```"):

            result_text = result_text[3:]

        if result_text.endswith("```"):

            result_text = result_text[:-3]

        result_text = result_text.strip()

        try:

            optimization = json.loads(
                result_text
            )

        except json.JSONDecodeError:

            print(
                "Invalid OpenRouter JSON:",
                result_text
            )

            raise HTTPException(
                status_code=500,
                detail="OpenRouter returned invalid optimization format"
            )

        optimized_analysis = optimization.get(
            "optimizedAnalysis",
            {}
        )

        ai_score = optimized_analysis.get(
            "atsScore",
            original_ats_score
        )

        if not isinstance(ai_score, (int, float)):
            ai_score = original_ats_score

        optimized_analysis["atsScore"] = max(
            int(original_ats_score),
            min(100, int(ai_score))
        )

        optimization["optimizedAnalysis"] = optimized_analysis


        return {
            "success": True,
            "optimization": optimization
        }

    except HTTPException:

        raise

    except Exception as error:

        print(
            "AI optimization error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to optimize resume"
        )

# ============================================================
# MOCK INTERVIEW AI
# ============================================================

class GenerateInterviewQuestionsRequest(BaseModel):
    targetJob: str
    interviewCategory: str = "All"
    numberOfQuestions: int = 5


class AnalyzeInterviewAnswerRequest(BaseModel):
    targetJob: str
    interviewCategory: str = "All"
    question: str
    answer: str
    responseMode: str = "Text"


class AnalyzeInterviewSessionRequest(BaseModel):
    targetJob: str
    interviewCategory: str = "All"
    questions: list



@app.post("/generate-interview-questions")
async def generate_interview_questions(
    request: GenerateInterviewQuestionsRequest
):
    try:
        # -----------------------------
        # VALIDATION
        # -----------------------------

        if not request.targetJob.strip():
            raise HTTPException(
                status_code=400,
                detail="Target job is required."
            )

        if request.interviewCategory not in [
            "Behavioral",
            "Technical",
            "HR Screening",
            "All"
        ]:
            raise HTTPException(
                status_code=400,
                detail="Invalid interview category."
            )

        if request.numberOfQuestions not in [5, 8, 12]:
            raise HTTPException(
                status_code=400,
                detail="Number of questions must be 5, 8, or 12."
            )

        # -----------------------------
        # CATEGORY INSTRUCTIONS
        # -----------------------------

        if request.interviewCategory == "Behavioral":
            category_instruction = """
Generate behavioral interview questions.

Focus on:
- Past experiences
- Problem solving
- Teamwork
- Communication
- Conflict handling
- Adaptability
- Leadership when relevant
- Workplace situations

Use questions that allow the applicant to explain their experience.
"""

        elif request.interviewCategory == "Technical":
            category_instruction = """
Generate technical interview questions relevant to the target job.

Focus on:
- Job-related technical knowledge
- Tools and technologies commonly relevant to the role
- Technical problem solving
- Practical situations
- Job-specific concepts

Do not require a technology or skill unless it is reasonably relevant
to the target job.
"""

        elif request.interviewCategory == "HR Screening":
            category_instruction = """
Generate HR screening questions.

Focus on:
- Introduction
- Motivation
- Career goals
- Work preferences
- Availability
- Strengths
- Areas for improvement
- Workplace expectations
"""

        else:
            category_instruction = """
Generate a balanced interview.

Include a mixture of:
- Behavioral questions
- Technical questions relevant to the target job
- HR screening questions

Keep the questions appropriate for the target job.
"""

        # -----------------------------
        # OPENROUTER PROMPT
        # -----------------------------

        prompt = f"""
You are an AI mock interview question generator.

Target Job:
{request.targetJob}

Interview Category:
{request.interviewCategory}

Number of Questions:
{request.numberOfQuestions}

{category_instruction}

IMPORTANT RULES:

1. Generate exactly {request.numberOfQuestions} questions.
2. Questions must be relevant to the target job.
3. Do not invent information about the applicant.
4. Do not assume the applicant has specific work experience.
5. Do not assume the applicant has specific certifications,
   education, technologies, or skills.
6. Questions should be answerable by students, graduates,
   career changers, and experienced applicants when appropriate.
7. Keep questions professional and realistic.
8. Avoid duplicate or nearly identical questions.
9. Do not ask multiple questions in one question.
10. Do not include answers.
11. Do not include explanations.
12. Do not make hiring decisions.
13. Keep the interview neutral across different professions.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "questions": [
        {{
            "questionNumber": 1,
            "question": "Question here"
        }}
    ]
}}
"""

        response = client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = response.choices[0].message.content.strip()

        # -----------------------------
        # CLEAN JSON
        # -----------------------------

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        result = json.loads(response_text)

        questions = result.get("questions", [])

        if len(questions) != request.numberOfQuestions:
            raise ValueError(
                f"Expected {request.numberOfQuestions} questions, "
                f"but received {len(questions)}."
            )

        return {
            "success": True,
            "questions": questions
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid question format."
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Generate interview questions error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to generate interview questions."
        )



@app.post("/analyze-interview-answer")
async def analyze_interview_answer(
    request: AnalyzeInterviewAnswerRequest
):
    try:
        # -----------------------------
        # VALIDATION
        # -----------------------------

        if not request.targetJob.strip():
            raise HTTPException(
                status_code=400,
                detail="Target job is required."
            )

        if not request.question.strip():
            raise HTTPException(
                status_code=400,
                detail="Question is required."
            )

        if not request.answer.strip():
            raise HTTPException(
                status_code=400,
                detail="Answer is required."
            )

        if request.responseMode not in ["Text", "Audio"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid response mode."
            )

        # -----------------------------
        # RESPONSE MODE INSTRUCTIONS
        # -----------------------------

        if request.responseMode == "Text":
            mode_instruction = """
The answer is provided as text.

Evaluate:
- Content
- Relevance
- Clarity
- Structure
- Natural wording
- Confidence as demonstrated through the written response

Do NOT claim to hear vocal tone, pronunciation, volume,
pitch, speaking speed, or actual voice modulation because
the response is text.
"""

        else:
            mode_instruction = """
The response mode is Audio.

However, unless actual audio/transcription information is
provided in the request, evaluate only the text answer.

Do not invent observations about:
- Voice
- Volume
- Pitch
- Speaking speed
- Pronunciation
- Actual vocal modulation
"""

        # -----------------------------
        # OPENROUTER PROMPT
        # -----------------------------

        prompt = f"""
You are an AI mock interview answer evaluator.

Target Job:
{request.targetJob}

Interview Category:
{request.interviewCategory}

Interview Question:
{request.question}

Applicant Answer:
{request.answer}

Response Mode:
{request.responseMode}

{mode_instruction}

Evaluate the answer fairly and professionally.

IMPORTANT RULES:

1. Evaluate ONLY what the applicant actually provided.
2. Do not invent experience, achievements, skills, education,
   responsibilities, or results.
3. Do not assume the applicant is experienced or inexperienced.
4. Do not penalize an applicant simply because they are a student
   or recent graduate.
5. Evaluate relevance to the question.
6. Evaluate how clearly the answer communicates its ideas.
7. Evaluate whether the answer provides enough supporting detail.
8. Identify strengths based only on the answer.
9. Identify improvements that would make the answer stronger.
10. Word suggestions must preserve the applicant's meaning.
11. Do not rewrite the applicant's answer completely.
12. Do not make hiring decisions.
13. Do not say whether the applicant should be hired.
14. Be neutral across all professions.

SCORING:

score:
Overall answer score from 0 to 100.

contentScore:
How well the answer addresses the question and provides
useful information.

confidenceScore:
How confidently the answer communicates its ideas based
only on the provided response.

naturalScore:
How natural, clear, and conversational the answer sounds.

IMPORTANT:
Scores must be numbers from 0 to 100.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "score": 0,
    "contentScore": 0,
    "confidenceScore": 0,
    "naturalScore": 0,

    "feedback": "Overall feedback about the answer.",

    "toneAndModulation": "Feedback about tone or modulation. For text responses, do not claim actual vocal observations.",

    "wordChoiceSuggestions": [
        {{
            "original": "original phrase",
            "suggestion": "better phrase",
            "reason": "Why this wording could be clearer."
        }}
    ],

    "strengths": [
        "Strength 1",
        "Strength 2"
    ],

    "improvements": [
        "Improvement 1",
        "Improvement 2"
    ]
}}
"""

        response = client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = response.choices[0].message.content.strip()

        # -----------------------------
        # CLEAN JSON
        # -----------------------------

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        result = json.loads(response_text)

        # -----------------------------
        # NORMALIZE SCORES
        # -----------------------------

        def normalize_score(value):
            try:
                value = int(float(value))

                if value < 0:
                    return 0

                if value > 100:
                    return 100

                return value

            except Exception:
                return 0

        result["score"] = normalize_score(
            result.get("score", 0)
        )

        result["contentScore"] = normalize_score(
            result.get("contentScore", 0)
        )

        result["confidenceScore"] = normalize_score(
            result.get("confidenceScore", 0)
        )

        result["naturalScore"] = normalize_score(
            result.get("naturalScore", 0)
        )

        # -----------------------------
        # SAFE DEFAULTS
        # -----------------------------

        result.setdefault(
            "feedback",
            "No additional feedback was provided."
        )

        result.setdefault(
            "toneAndModulation",
            "No additional tone information was provided."
        )

        result.setdefault(
            "wordChoiceSuggestions",
            []
        )

        result.setdefault(
            "strengths",
            []
        )

        result.setdefault(
            "improvements",
            []
        )

        return {
            "success": True,
            "analysis": result
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid answer analysis format."
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Analyze interview answer error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze interview answer."
        )


@app.post("/analyze-interview-session")
async def analyze_interview_session(
    request: AnalyzeInterviewSessionRequest
):
    try:
        # -----------------------------
        # VALIDATION
        # -----------------------------

        if not request.targetJob.strip():
            raise HTTPException(
                status_code=400,
                detail="Target job is required."
            )

        if not request.questions:
            raise HTTPException(
                status_code=400,
                detail="Interview questions are required."
            )

        # -----------------------------
        # OPENROUTER PROMPT
        # -----------------------------

        questions_json = json.dumps(
            request.questions,
            ensure_ascii=False,
            indent=2
        )

        prompt = f"""
You are an AI mock interview session evaluator.

Target Job:
{request.targetJob}

Interview Category:
{request.interviewCategory}

Completed Interview:

{questions_json}

Evaluate the applicant's complete interview performance.

IMPORTANT RULES:

1. Evaluate only the answers provided.
2. Do not invent applicant information.
3. Do not assume missing experience or skills.
4. Do not make hiring decisions.
5. Do not say whether the applicant should be hired.
6. Be fair to students, graduates, career changers,
   and experienced applicants.
7. Consider the target job when evaluating relevance.
8. Use the individual answer scores when available.
9. The final score should represent the complete interview.

Skill breakdown:

communication:
How clearly the applicant communicates.

technicalKnowledge:
Relevant technical knowledge demonstrated in the answers.
If the interview does not provide enough technical evidence,
use a reasonable score based only on available evidence.

problemSolving:
Ability to explain reasoning, decisions, and solutions.

confidence:
Confidence demonstrated through the responses.
Do not infer psychological traits.

relevance:
How relevant the answers are to the questions and target job.

All scores must be from 0 to 100.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "overallScore": 0,

    "skillBreakdown": {{
        "communication": 0,
        "technicalKnowledge": 0,
        "problemSolving": 0,
        "confidence": 0,
        "relevance": 0
    }}
}}
"""

        response = client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = response.choices[0].message.content.strip()

        # -----------------------------
        # CLEAN JSON
        # -----------------------------

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        result = json.loads(response_text)

        # -----------------------------
        # NORMALIZE SCORE
        # -----------------------------

        def normalize_score(value):
            try:
                value = int(float(value))

                if value < 0:
                    return 0

                if value > 100:
                    return 100

                return value

            except Exception:
                return 0

        result["overallScore"] = normalize_score(
            result.get("overallScore", 0)
        )

        skill_breakdown = result.get(
            "skillBreakdown",
            {}
        )

        result["skillBreakdown"] = {
            "communication": normalize_score(
                skill_breakdown.get("communication", 0)
            ),
            "technicalKnowledge": normalize_score(
                skill_breakdown.get("technicalKnowledge", 0)
            ),
            "problemSolving": normalize_score(
                skill_breakdown.get("problemSolving", 0)
            ),
            "confidence": normalize_score(
                skill_breakdown.get("confidence", 0)
            ),
            "relevance": normalize_score(
                skill_breakdown.get("relevance", 0)
            )
        }

        return {
            "success": True,
            "analysis": result
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid session analysis format."
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Analyze interview session error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze interview session."
        )


class ValidateJobRequest(BaseModel):
    targetJob: str


@app.post("/validate-job")
async def validate_job(
    request: ValidateJobRequest
):
    try:
        # -----------------------------
        # VALIDATION
        # -----------------------------

        if not request.targetJob.strip():
            raise HTTPException(
                status_code=400,
                detail="Target job is required."
            )

        # -----------------------------
        # OPENROUTER PROMPT
        # -----------------------------

        prompt = f"""
Determine if the following input is a valid job title or profession.

Target Job:
{request.targetJob}

Return false for random gibberish, meaningless text,
or input that is not a job.

Return ONLY valid JSON:

{{
    "isValid": true
}}

If invalid:

{{
    "isValid": false
}}
"""

        response = client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        response_text = response.choices[0].message.content.strip()

        # -----------------------------
        # CLEAN JSON
        # -----------------------------

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        result = json.loads(response_text)

        # -----------------------------
        # NORMALIZE RESULT
        # -----------------------------

        is_valid = result.get("isValid", False)

        if not isinstance(is_valid, bool):
            is_valid = False

        return {
            "success": True,
            "isValid": is_valid
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid job validation format."
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Validate job error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to validate job title."
        )


@app.get("/")
async def root():

    return {
        "success": True,
        "message": "OpenRouter AI Resume Service is running"
    }