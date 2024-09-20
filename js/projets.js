const ecran = document.getElementById('ecran');
const backgroundEcran = document.getElementById('background-ecran');

backgroundEcran.addEventListener('click', ()=>{
    backgroundEcran.style.opacity = '0';
    setTimeout(()=>{
        backgroundEcran.style.display = 'none';
    },400);

    ecran.style.top = '-110%';
})


function afficherEcran(url){
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du fichier");
            }
            return response.text();
        })
        .then(data => {
            ecran.innerHTML = data;
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
    
    ecran.style.top = "60%";
    setTimeout(()=>{
        ecran.style.top = "50%";
    },400);
    
    backgroundEcran.style.display = 'block';
    backgroundEcran.style.opacity = '1';
    }