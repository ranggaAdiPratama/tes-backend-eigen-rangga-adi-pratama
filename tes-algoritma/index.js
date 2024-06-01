const reverseString = (string) => {
  const letters = string.match(/[a-zA-Z]/g).reverse();

  let reversedString = "";
  let letterIndex = 0;

  for (let char of string) {
    if (/[a-zA-Z]/.test(char)) {
      reversedString += letters[letterIndex++];
    } else {
      reversedString += char;
    }
  }

  return reversedString;
};

const longestWordinSentence = (sentence) => {
  const words = sentence.split(" ");

  let longestWord = "";
  let maxLength = 0;

  for (let word of words) {
    if (word.length > maxLength) {
      longestWord = word;
      maxLength = word.length;
    }
  }

  return { longestWord, maxLength };
};

const getSimiilarity = (input, query) => {
  let result = [];

  for (let i = 0; i < query.length; i++) {
    result[i] = input.filter((element) => element === query[i]).length;
  }

  return result;
};

function diagonalDifference(matrix) {
  let n = matrix.length;

  let primaryDiagonalSum = 0;
  let secondaryDiagonalSum = 0;

  for (let i = 0; i < n; i++) {
    primaryDiagonalSum += matrix[i][i];
    secondaryDiagonalSum += matrix[i][n - i - 1];
  }

  let difference = Math.abs(primaryDiagonalSum - secondaryDiagonalSum);

  return difference;
}

let matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(
  `1. Terdapat string "NEGIE1", silahkan reverse alphabet nya dengan angka tetap diakhir kata Hasil = "EIGEN1"`
);
console.log(`Jawaban =  ${reverseString("NEGIE1")}`);
console.log(
  "2. Diberikan contoh sebuah kalimat, silahkan cari kata terpanjang dari kalimat tersebut, jika ada kata dengan panjang yang sama silahkan ambil salah satu."
);
console.log(
  `Jawaban = ${
    longestWordinSentence("Saya sangat senang mengerjakan soal algoritma")
      .longestWord
  }: ${
    longestWordinSentence("Saya sangat senang mengerjakan soal algoritma")
      .maxLength
  } character`
);
console.log(
  "3. Terdapat dua buah array yaitu array INPUT dan array QUERY, silahkan tentukan berapa kali kata dalam QUERY terdapat pada array INPUT."
);
console.log(
  `Jawaban = [${getSimiilarity(
    ["xc", "dz", "bbb", "dz"],
    ["bbb", "ac", "dz"]
  )}]`
);
console.log(
  "4. Silahkan cari hasil dari pengurangan dari jumlah diagonal sebuah matrik NxN."
);
console.log(`Jawaban = ${diagonalDifference(matrix)}`);
