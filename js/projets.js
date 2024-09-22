const ContainerEcran = document.getElementById('container-ecran');
const ecran = document.getElementById('ecran');
const backgroundEcran = document.getElementById('background-ecran');
const html = document.getElementsByTagName('html')[0];

backgroundEcran.addEventListener('click', ()=>{
    fermerEcran();
})

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        fermerEcran();
    }
});


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

            ContainerEcran.style.top = "60%";
            setTimeout(()=>{
            ContainerEcran.style.top = "50%";
            },400);
            
            backgroundEcran.style.display = 'block';
            backgroundEcran.style.opacity = '1';

            html.style.overflowY = 'hidden';
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
    }


function fermerEcran(){
    backgroundEcran.style.opacity = '0';
    html.style.overflowY = 'auto';
    setTimeout(()=>{
        backgroundEcran.style.display = 'none';
        ecran.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    },400);

    ContainerEcran.style.top = '-110%';
}