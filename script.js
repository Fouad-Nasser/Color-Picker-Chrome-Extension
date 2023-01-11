const startBtn = document.getElementById("startBtn");
const clearAll = document.querySelector(".clear-all");
const colorList = document.querySelector(".picked-colors-list");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

// create function to show color
function showColor(){
    // clear old colors
    colorList.innerHTML = '';

    // Return if there are no picked colors
    if(!pickedColors.length){
        document.querySelector(".picked-colors").classList.add("hide");
         return; 
    }
    

    // loop on picked colors and display it
    for (let i = 0; i < pickedColors.length; i++) {
        let li = document.createElement('li');
        li.classList.add('color');
        li.innerHTML = `
            <span class="rect" style="background: ${pickedColors[i]}; border: 1px solid ${pickedColors[i] == "#ffffff" ? "#ccc": pickedColors[i]}"></span>
            <span class="value hex" data-color="${pickedColors[i]}">${pickedColors[i]}</span>
        `;

        let copyBtn = document.createElement('span');
        copyBtn.classList.add('copy');
        copyBtn.innerHTML = `
            <i class="ri-file-copy-line"></i>
            <span></span>

        `;

        copyBtn.addEventListener('click',()=>{copy(copyBtn,pickedColors[i])});

        let deleteBtn = document.createElement('span');
        deleteBtn.classList.add('delete');
        deleteBtn.innerHTML = `
        <i class="ri-delete-bin-line"></i>
        `;

        deleteBtn.addEventListener('click',()=>{deleteColor(i)});

        li.appendChild(copyBtn);
        li.appendChild(deleteBtn);
        colorList.appendChild(li);
    }

    document.querySelector(".picked-colors").classList.remove("hide");

    
}
showColor();

// create function to start Eye Dropper
function showEyeDropper(){
    document.body.style.display = "none";
    setTimeout(async () => {
        try {
            // Open the eye dropper and get the picked color
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            navigator.clipboard.writeText(sRGBHex);

            // push the color to the list if it doesn't exist
            if(!pickedColors.includes(sRGBHex)) {
                pickedColors.push(sRGBHex);
                localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
                console.log(pickedColors);
                showColor();
            }
        } catch (error) {
            alert("Failed to copy the color code!");
        }
        document.body.style.display = "block";
    }, 10);
}


// create function to show color Copy the color code to the clipboard 
const copy = (ele,color) => {
    ele.lastElementChild.innerText = "Copied";
    navigator.clipboard.writeText(color);
    setTimeout(() => ele.lastElementChild.innerText = '', 1000);
}


// create function to delete color
function deleteColor(i){
    pickedColors.splice(i, 1);
    localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
    showColor();
}


// create function to Clear all picked colors and update local storage
function clearAllColors (){
    pickedColors.length = 0;
    localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
    document.querySelector(".picked-colors").classList.add("hide");
}

clearAll.addEventListener("click", clearAllColors);
startBtn.addEventListener("click", showEyeDropper);