let progressText = null;

function UnityProgress(progress)
{
  if (!progressText)
  {
    progressText = document.getElementById("loader-area__percent");
    progressText.style.display = "block";
  }

  setLoaderProgressTo(progress);

  if (progress == 1)
  {
    console.log('--End load the page!--');
    document.getElementById("loader").style.display = "none";
  }
}

// value - 0 to 1
function setLoaderProgressTo(value)
{
  progressText.innerHTML = (value * 100).toFixed() + "%";
}

window.onlanguagechange = function(event) 
{
  loadLoaderLocalization();
};

window.addEventListener('load', (event) => {
  loadLoaderLocalization();
});

function loadLoaderLocalization() 
{
  const label = document.getElementById("loader-area__label");
  const percent = document.getElementById("loader-area__percent");
  label.innerHTML =  GetLoadingScreenLocalization().value;
  let percentage = 0;
  percent.innerHTML = percentage + "%";
}
