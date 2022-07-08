let filledProgress = null;
function UnityProgress(progress)
{
  if(!filledProgress)
  {
      filledProgress = document.getElementById("loader-progress__filled");
      filledProgress.style.display = "block";
  }

  setLoaderProgressTo(progress, 300);

  if (progress == 1)
  {
    console.log('--End load the page!--');
    document.getElementById("loader").style.display = "none";
  }
}

// value - 0 to 1
function setLoaderProgressTo(value, duration)
{
    if(duration == null)
        duration = 300;
    
    filledProgress.animate(
        [
            { width: (value * 100) + "%" }
        ],
        {
            duration: duration,
            fill: "forwards"
        }
    );
}

window.onlanguagechange = function(event) 
{
  loadLoaderLocalization();
};

window.addEventListener('load', (event) => {
  loadLoaderLocalization();
  setLoaderProgressTo(0, 0);
});

function loadLoaderLocalization() 
{
  const label = document.getElementById("loader-area__label");
  label.innerHTML = GetLoadingScreenLocalization().value;
}
