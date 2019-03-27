let outputs = [];
// The 'K' in K-Nearest Neightbor, or the top results to look at
const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 10;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

  let numberCorrect = 0;
  for (let i = 0; i < testSet.length; i++) {
    const bucket = knn(trainingSet, testSet[i][0]);
    if (bucket === testSet[i][3]) {
      numberCorrect++;
    }
  }

  console.log('Accuracy: ', numberCorrect / testSetSize);
}

function knn(data, point) {
  // Start a lodash chain and pass in our outputs arrya
  return (
    _.chain(data)
      // Create a new array with only the dropPosition and bucketLabel
      // get the absolute value of these numbers
      .map(row => [distance(row[0], point), row[3]])
      // Sort by drop position
      .sortBy(row => row[0])
      // Only keep the top 'k' results
      .slice(0, k)
      // Count the number of times the bucketLabel appears in the array, this turns numbers to strings
      .countBy(row => row[1])
      // Convert object into an array
      .toPairs()
      // Sort by the number of times the bucketLabel appears in the array
      .sortBy(row => row[1])
      // Take only the last element in the outter array
      .last()
      // Select only the first element of the inner array (the bucket number that occured the most)
      .first()
      // Convert the string back to number
      .parseInt()
      // End our chain
      .value()
  );
}

// Helper function to get the absolute value of the points
function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
