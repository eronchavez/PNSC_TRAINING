// "use strict";

function minimumInsertions(input) {
    const stack = [];
    const matchingOpening = {
        ")": "(",
        "]": "[",
        "}": "{",
    };

    let insertions = 0;

    for (const bracket of input) {
        if (bracket === "(" || bracket === "[" || bracket === "{") {
            stack.push(bracket);
            continue;
        }

        // Close incompatible openings one at a time. The current closing
        // bracket is then compared again with the new top of the stack.
        while (stack.length > 0 && stack.at(-1) !== matchingOpening[bracket]) {
            stack.pop();
            insertions += 1;
        }

        if (stack.length === 0) {
            // Insert the opening bracket that this closing bracket requires.
            insertions += 1;
        } else {
            stack.pop();
        }
    }

    // Every opening bracket still in the stack needs one closing bracket.
    return insertions + stack.length;
}

// if (typeof module !== "undefined" && module.exports) {
//     module.exports = minimumInsertions;
// }
