// This code should run after the user clicks the extension icon.
document.addEventListener("mouseup", function (e) {
  var selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    var existingTooltip = document.querySelector(".custom-tooltip");
    if (existingTooltip) {
      existingTooltip.remove();
    }
    var tooltip = createTooltipElement(selectedText);
    document.body.appendChild(tooltip);
    positionTooltip(e, tooltip);

    // Delay the addition of click listener to remove the tooltip
    setTimeout(function () {
      document.addEventListener("click", function handler(e) {
        if (!tooltip.contains(e.target)) {
          tooltip.remove();
          // Remove this event listener after it's executed once
          document.removeEventListener("click", handler);
        }
      });
    }, 10); // 10 milliseconds delay
  }
});

function createTooltipElement(selectedText) {
  var tooltip = document.createElement("div");
  tooltip.setAttribute("class", "custom-tooltip");
  tooltip.innerText = `Loading meaning for "${selectedText}"...`;

  // Call getMeaning asynchronously and then set the tooltip's text
  getMeaning(selectedText)
    .then((meaning) => {
      tooltip.innerText = `Meaning of "${selectedText}": ${meaning}`;
    })
    .catch(() => {
      tooltip.innerText = `Could not fetch meaning for "${selectedText}".`;
    });

  return tooltip;
}

function getMeaning(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Access the first meaning's first definition
      if (data.length > 0 && data[0].meanings.length > 0) {
        const definition = data[0].meanings[0].definitions[0].definition;
        return definition;
      }
      throw new Error("No definition found");
    })
    .catch((error) => {
      console.error("Error fetching definition:", error);
      throw error; // Re-throw the error to be handled by the caller
    });
}

function positionTooltip(mouseEvent, tooltip) {
  var posX = mouseEvent.clientX;
  var posY = mouseEvent.clientY;

  // Get the dimensions of the tooltip
  var tooltipWidth = tooltip.offsetWidth;
  var tooltipHeight = tooltip.offsetHeight;

  // Calculate the position to place it above the selected word
  var posX = mouseEvent.clientX - tooltipWidth / 2;
  var posY = mouseEvent.clientY - tooltipHeight - 10; // 10px above the cursor

  // Adjust if the tooltip goes beyond the left edge of the screen
  if (posX < 0) {
    posX = 10; // 10px from the left edge
  }

  // Adjust if the tooltip goes beyond the right edge of the screen
  if (posX + tooltipWidth > window.innerWidth) {
    posX = window.innerWidth - tooltipWidth - 10; // 10px from the right edge
  }

  // Adjust if the tooltip goes above the top edge of the screen
  if (posY < window.scrollY) {
    posY = mouseEvent.clientY + 20; // Place it below the cursor if it goes above the viewport
  }

  //styling
  tooltip.style.position = "absolute";
  tooltip.style.zIndex = "1000";
  tooltip.style.padding = "5px";
  tooltip.style.maxWidth = "300px";
  tooltip.style.background = "#9cf0cd";
  tooltip.style.border = "1px solid black";
  tooltip.style.borderRadius = "8px";
  // Position the tooltip
  tooltip.style.left = posX + "px";
  tooltip.style.top = posY + "px";
  tooltip.style.visibility = "visible";
}

// Code to remove tooltip if clicked outside
document.addEventListener("click", function (e) {
  var tooltip = document.querySelector(".custom-tooltip");

  //checking condition if their is tooltip in webpage & user has clicked outside the tooltip then remove the tooltip

  if (tooltip && !e.target.equals(tooltip)) {
    tooltip.remove();
  }
});
