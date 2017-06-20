const capitalize = word => word.charAt(0).toUpperCase() + word.substring(1)

const toCapitalizedWords = (name) => {
  const words = name.match(/[A-Za-z][a-z]*/g)

  return words.map(capitalize).join(' ')
}

const validationErrorsMap = validate => ({ errors: validate.errors.map((e) => {
  if (e.type === 'notNull Violation') {
    return `${toCapitalizedWords(e.path)} is required.`
  }

  if (e.type === 'unique violation') {
    return `The ${toCapitalizedWords(e.path)} already exists.`
  }

  return e.message
}) })

export default validationErrorsMap
