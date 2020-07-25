export const getRandomProperty = (obj, answer = false) => {
  
  let keys = Object.keys(obj)

  // If we need to make an excepetion for one answer
  if(answer !== false) keys.splice(keys.indexOf(answer), 1)
  
  let index = getNonUniformRandomIndex(keys.length)
  let response = obj[keys[index]]

  // Add the caracter (the key in the object) in the response
  response.character = keys[index]

  return response
}

export const getRandomIndex = (obj) => {
  let keys = Object.keys(obj)
  return keys[getNonUniformRandomIndex(keys.length)]
}

/**
 * Produces a non uniform random distribution to overrepresent the most recent words
 * Uniform: 0 to 99. Non uniform: 0 to 194. 195 = 50 + 25*2 + 15*3 + 10*5
 * The first 50% and last 10% words will be selected 25.6% of the times (50/195)
 */
export const getNonUniformRandomIndex = (length) => {
  // For short word lists, we keep the uniform distribution
  if(length < 40) return length * Math.random() << 0
  
  let uniformRand = Math.random() * 1.95
  let rand = uniformRand - 0.95
  if(uniformRand < 1.45) rand = uniformRand - 0.55
  if(uniformRand < 1.0) rand = uniformRand - 0.25
  if(uniformRand < 0.5) rand = uniformRand
  return length * rand << 0
}

/**
 * @see https://gist.github.com/gordonbrander/2230317
 */
export const getUniqID = () => ('_' + Math.random().toString(36).substr(2, 9))

/**
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export const getShuffledArr = (arr) => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr
}
