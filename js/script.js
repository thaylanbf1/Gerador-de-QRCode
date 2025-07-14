const container = document.querySelector(".container")
const qrCodeBtn = document.querySelector(".generate")
const qrCodeInput = document.querySelector("#url-input")
const qrCodeImg = document.querySelector("#qr-code img")
const qrCodeDiv = document.querySelector("#qr-code")
const fgColorInput = document.querySelector("#fg-color")
const bgColorInput = document.querySelector("#bg-color")
const borderSelect = document.querySelector("#border-style")
const iconOptions = document.querySelectorAll(".icon-option")

let selectedIcon = "";
let qrCodeGenrated = false


iconOptions.forEach(option => {
    option.addEventListener("click", () => {
        iconOptions.forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");
        selectedIcon = option.dataset.icon;

        if (qrCodeGenrated && qrCodeInput.value.trim()){
            gerarQrCode();
        }
    });
});


borderSelect.addEventListener("change", () =>{
    if(qrCodeGenrated && qrCodeImg.src && qrCodeImg.src !== "" && qrCodeImg.src.includes("data:image")){
        applyBorderStyle();
    }
});

fgColorInput.addEventListener("change", () => {
    if(qrCodeGenrated && qrCodeInput.value.trim()){
        gerarQrCode()
    }
});

bgColorInput.addEventListener("change", () =>{
    if (qrCodeGenrated && qrCodeInput.value.trim()){
        gerarQrCode()
    }
});


function gerarQrCode(){
   const qrCodeInputValue = qrCodeInput.value.trim();

        const errorMessage = document.querySelector('.error');
        if(errorMessage) errorMessage.remove();


            if(!qrCodeInputValue) {
                qrCodeInput.style.borderColor = "red";
                qrCodeInput.placeholder = "Por favor insira um texto ou uma URL!";
                qrCodeInput.focus();
                return;
            }

            qrCodeBtn.innerHTML = "Gerando código...";
            qrCodeBtn.disabled = true;

            const fgColor = fgColorInput.value.replace("#", "");
            const bgColor = bgColorInput.value.replace("#", "");

            const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeInputValue)}&color=${fgColor}&bgcolor=${bgColor}`;

            
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            img.onload = function() {
                if (selectedIcon && selectedIcon !== "") {
                    overlayIcon(img, fgColor, bgColor);
                } else {
                    qrCodeImg.src = img.src;
                }
                
                setTimeout(() => {
                    applyBorderStyle()
                }, 100);

                qrCodeGenrated = true;
            
                
                container.classList.add("active");
                qrCodeDiv.classList.add("show");
                qrCodeBtn.innerHTML = "Código gerado!";
                qrCodeBtn.disabled = false;

                setTimeout(() => {
                    qrCodeBtn.innerHTML = "Gerar";
                }, 2000);
            };

            img.onerror = function() {
                qrCodeBtn.innerHTML = "Erro ao gerar";
                qrCodeBtn.disabled = false;
                setTimeout(() => {
                    qrCodeBtn.innerHTML = "Gerar";
                }, 2000);
            };

            img.src = apiUrl;
}

function applyBorderStyle() {
    const borderStyle = borderSelect.value;
    const fgColor = fgColorInput.value;
    const bgColor = bgColorInput.value;


    qrCodeImg.classList.remove("qr-border-solid", "qr-border-dashed", "qr-border-dotted", "qr-border-gradient", "qr-border-shadow");

    qrCodeImg.style.border = "";
    qrCodeImg.style.boxShadow = "";
    qrCodeImg.style.background = "";
    qrCodeImg.style.padding = ""; 

    if(borderStyle !== "none"){
        switch(borderStyle){
            case 'gradient':
                qrCodeImg.style.border = "5px solid transparent";
                qrCodeImg.style.background = `linear-gradient(45deg, ${fgColor}, ${bgColor}, ${fgColor}, ${bgColor})`;
                qrCodeImg.style.backgroundClip = "border-box";
                qrCodeImg.style.padding = "5px";
                break;
        }
    }
}

function overlayIcon(qrImage, fgColor, bgColor){
    if(!selectedIcon || selectedIcon === "") {
        qrCodeImg.src = qrImage.src;
        return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 300;
    canvas.height = 300;

    ctx.drawImage(qrImage, 0, 0, 300, 300);

    const centerSize = 60;
    const centerX = (canvas.width - centerSize) / 2;
    const centerY = (canvas.height - centerSize) / 2;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, centerSize / 2, 0, 2 * Math.PI);
    ctx.fill()

    ctx.globalCompositeOperation = 'source-over';


    ctx.font = "50px 'Font Awesome 6 Brands'";
    ctx.fillStyle = `#${fgColor}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const iconMap = {
        "fa-brands fa-github": "\uf09b",
        "fa-brands fa-instagram": "\uf16d",
        "fa-brands fa-telegram": "\uf2c6",
        "fa-brands fa-google": "\uf1a0",
        "fa-brands fa-facebook": "\uf09a",
        "fa-brands fa-whatsapp": "\uf232",
        "fa-brands fa-discord": "\uf392",
        "fa-brands fa-linkedin": "\uf08c",
        "fa-brands fa-wpforms": "\uf298",
        "fa-brands fa-x-twitter": "\ue61b",
        "fa-brands fa-edge": "\uf282"
    };

    const iconChar = iconMap[selectedIcon] || "?";
    ctx.fillText(iconChar, canvas.width / 2, canvas.height / 2);

    qrCodeImg.src = canvas.toDataURL();
}

function captureQrBorder() {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const borderStyle = borderSelect.value;

        const fgColor = fgColorInput.value;
        const bgColor = bgColorInput.value;

        let borderSize = 0;
        if(borderStyle !== "none"){
            borderSize = borderStyle === 'gradient' ? 10:20;
        }

        
        const qrSize = 300;
        canvas.width = qrSize + (borderSize * 2)
        canvas.height = qrSize + (borderSize * 2)


        if(borderStyle !== "none"){
        switch (borderStyle) {
            case 'gradient':
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, fgColor);
                gradient.addColorStop(0.33, bgColor);
                gradient.addColorStop(0.66, fgColor);
                gradient.addColorStop(1, bgColor)
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
            default:
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                break;
        }
        }else{
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        if(!qrCodeImg.src || qrCodeImg.src === ""){
            console.error("QR Code image not loaded");
            resolve(canvas.toDataURL());
            return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = function() {
            
        ctx.drawImage(img, borderSize, borderSize, qrSize, qrSize);
            
            
            if (selectedIcon && selectedIcon !== "") {
                const centerSize = 60;
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(centerX, centerY, centerSize / 2, 0, 2 * Math.PI);
                ctx.fill();

                
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'none';
                ctx.beginPath();
                ctx.arc(centerX, centerY, centerSize / 2, 0, 2 * Math.PI);
                ctx.fill();

              
                ctx.globalCompositeOperation = 'source-over';
                ctx.font = "50px 'Font Awesome 6 Brands'";
                ctx.fillStyle = `${fgColor}`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                const iconMap = {
                    "fa-brands fa-github": "\uf09b",
                    "fa-brands fa-instagram": "\uf16d",
                    "fa-brands fa-telegram": "\uf2c6",
                    "fa-brands fa-google": "\uf1a0",
                    "fa-brands fa-facebook": "\uf09a",
                    "fa-brands fa-whatsapp": "\uf232",
                    "fa-brands fa-discord": "\uf392",
                    "fa-brands fa-linkedin": "\uf08c",
                    "fa-brands fa-wpforms": "\uf298",
                    "fa-brands fa-x-twitter": "\ue61b",
                    "fa-brands fa-edge": "\uf282"
                };
                const iconChar = iconMap[selectedIcon] || "?";
                ctx.fillText(iconChar, centerX, centerY);
            }
            
            resolve(canvas.toDataURL());
        };

        img.onerror = function(){
            console.error("Error loading QR Code image for PDF");
            resolve(canvas.toDataURL());
        }

        img.src = qrCodeImg.src;

    });
}


qrCodeBtn.addEventListener("click", () => {
    gerarQrCode();
})

qrCodeInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
        gerarQrCode();
    }
})



qrCodeInput.addEventListener("input", () => {
    if(!qrCodeInput.value.trim()){
        container.classList.remove("active");
        qrCodeDiv.classList.remove("show");
        qrCodeBtn.innerHTML ="Gerar QR Code";
        qrCodeImg.src = "";
    }
});

async function downloadPdf() {
    const {jsPDF} = window.jspdf;

    
    const imgData = await captureQrBorder()

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format :'a4'
    });


    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = 80;
    const imgHeight = 80;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    pdf.setFontSize(16);
    pdf.text('QR Code Personalizado', pageWidth / 2, y-20, {align: 'center'});

    pdf.save('qrcode-personalizado.pdf');
}

async function dowlnoadPng() {
    if (!qrCodeGenrated || !qrCodeImg.src || qrCodeImg.src === "") return;

    try {
        imgData = await captureQrBorder();

        const link = document.createElement('a');
        link.download = 'qrCode-Personalizado.png';
        link.href = imgData;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Erro ao baixar PNG", error);
    }
}