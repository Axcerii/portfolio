const video = document.getElementById('first_image');

document.addEventListener("DOMContentLoaded", function(){
    const loadingImage = this.getElementById('loading_image');

    video.addEventListener('canplaythrough', function(){
        loadingImage.style.opacity = 0;
    })

});

window.addEventListener('scroll', function() {
    const invitation = document.querySelector('.scroll-invitation');
    invitation.style.opacity = 1 - window.pageYOffset / 150;
    video.style.opacity = 1 - window.pageYOffset / 500;
  });


  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});


function toggleHeaderOnMobile() {
    var header = document.querySelector('header');
    header.classList.toggle('hidden');
}

function isMobileScreen() {
    return window.innerWidth < 768;
}

function switchButtonIcon(open){
    var button = document.getElementById('menu-burger');
    
    if(open == 'open'){
        button.src='images/cross.svg';
        button.setAttribute('onclick','closeHeader()');
    }
    else if(open = 'close'){
        button.src='images/burger.svg';
        button.setAttribute('onclick','openHeader()');
    }
    else{
        console.log('Erreur dans les paramètres de la fonction switchButtonIcon');
    }
}

function openHeader(){
    switchButtonIcon('open');
    document.getElementById('nav-header').style.display = 'block';
}

function closeHeader(){
    switchButtonIcon('close');
    document.getElementById('nav-header').style.display = 'none';
}

