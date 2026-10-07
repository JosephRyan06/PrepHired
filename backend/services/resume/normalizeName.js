const normalizeName = (name = "") => {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const namesMatch = (
  userName,
  resumeName
) => {
  const user =
    normalizeName(userName);

  const resume =
    normalizeName(resumeName);

  if (!user || !resume) {
    return false;
  }

  if (user === resume) {
    return true;
  }

  const userParts = user.split(" ");
  const resumeParts = resume.split(" ");

  return (
    resumeParts.length >= 2 &&
    resumeParts.every((part) =>
      userParts.includes(part)
    )
  );
};

module.exports = {
  normalizeName,
  namesMatch,
};
