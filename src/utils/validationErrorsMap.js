const capitalize = word => word.charAt(0).toUpperCase() + word.substring(1)

const toCapitalizedWords = (name) => {
  const words = name.match(/[A-Za-z][a-z]*/g)

  return words.map(capitalize).join(' ')
}

module.exports = validate => ({ errors: validate.errors.map((e) => {
  if (e.type === 'notNull Violation') {
    return `${toCapitalizedWords(e.path)} is required.`
  }

  return e.message
}) })
