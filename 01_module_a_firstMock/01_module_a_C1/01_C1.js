 function submit()
      {

        const letters = document.getElementById("letters")
        const uppercase = document.getElementById("uppercase")
        const lowercase = document.getElementById("lowercase")

        let textInput = document.getElementById('textInput')
        let value = textInput.value

        let upperCase = value.match(/[A-Z]/g);
        let upperCaseCount = (upperCase) ? upperCase.length : 0

        let lowerCase = value.match(/[a-z]/g);
        let lowerCaseCount = (lowerCase) ? lowerCase.length : 0

        let totalLetters = value.match(/[A-Z,a-z]/g);
        let totalLetterCount = (totalLetters) ? totalLetters.length : 0

        letters.textContent = totalLetterCount;
        uppercase.textContent = upperCaseCount;
        lowercase.textContent = lowerCaseCount;
 
      }