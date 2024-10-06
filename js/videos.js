function getTimeString(sec) {
  const hour = parseInt(sec / 3600);
  let remainingSecond = sec % 3600;
  const minute = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;
  return `${hour} hrs ${minute} min ${remainingSecond} sec ago`;
}

function removeActiveClass(){
     const removeBtn = document.getElementsByClassName('category-btn');
     for (const btn of removeBtn) {
          btn.classList.remove('active');
     }
}

//details button function
const detailsButton = (videoId) =>{

  fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`)
  .then(res => res.json())
  .then(data => showVideoDetails(data.video))
  .catch(err => console.error('Error:', err));

}
const showVideoDetails = (video) =>{
  const videoDetails = document.getElementById('detailsContainer');
  videoDetails.innerHTML = `
  <img src=${video.thumbnail} >
  <p>${video.description}</p>
  `
  document.getElementById('showModal').showModal();
}

function loadCategoriesVideo(id) {

  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
     removeActiveClass();
     const activeBtn = document.getElementById(`active-${id}`)
     activeBtn.classList.add('active')
     displayVideos(data.category)
    })
    .catch((err) => console.error("Error:", err));
}
// load category from API and create buttons
const loadData = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayData(data.categories))
    .catch((err) => console.error("Error:", err));
};

const displayData = (categories) => {
  const topButtons = document.getElementById("top-button");
  categories.forEach((element) => {
    const div = document.createElement("div");
    div.innerHTML = `
     <button id="active-${element.category_id}" onclick="loadCategoriesVideo(${element.category_id})" class="btn category-btn">${element.category}
     </button>
     `;
    topButtons.appendChild(div);
  });
};

loadData();


// load dynamic video section from API and create video section
const loadVideos = async (serachInput = "") => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/videos?title=${serachInput}`
    );
    const data = await res.json();
    //     console.log(data.videos);
    displayVideos(data.videos);
  } catch (error) {
    console.log("Error:", error);
  }
};

const displayVideos = (videos) => {
  const videosContainer = document.getElementById("videos-container");
  videosContainer.innerHTML = "";

  if(videos.length === 0){
     videosContainer.classList.remove("grid");
     videosContainer.innerHTML = `
     <div class="flex flex-col gap-4 min-h-[400px] justify-center items-center text-center">
     <img src="./assets/Icon.png"/>
     <p class="font-bold text-3xl">Oops!! Sorry, There is no <br> content here
     </p>
     </div>
     `;
     return;
  }
  else{
     videosContainer.classList.add("grid");
  }
  videos.forEach((video) => {
    const card = document.createElement("div");
    card.classList = "card card-compact";
    card.innerHTML = `
     <figure class="h-[200px] rounded-lg relative">
    <img class="w-full h-full object-cover"
      src= ${video.thumbnail}
      alt="Shoes" />
     ${
       video.others.posted_date?.length === 0
         ? ""
         : `<span class="absolute right-2 bottom-2 bg-black rounded-md py-1 px-2 text-white text-[10px]">${getTimeString(
             video.others.posted_date
           )}</span>`
     } 
      
  </figure>
  <div class="py-5 flex gap-4">
  <div class="">
  <img class="h-10 w-10 rounded-full object-cover" src=${
    video.authors[0].profile_picture
  } />
  </div>
  <div>
  <h5 class="font-bold">${video.title}
  </h5>
  <div class="flex items-center gap-3">
  <P class="text-gray-600 text-sm">${video.authors[0].profile_name}
  </P>
  ${
    video.authors[0].verified == true
      ? `<img class="h-5 w-5" src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png"/> `
      : ""
  }
  </div>
  <div class="">
  <button onclick="detailsButton('${video.video_id}')" class="mt-4 btn btn-sm btn-accent object-right"> Details</button>
  </div>
  </div>
  </div>
     `;
    videosContainer.appendChild(card);
  });
};
document.getElementById('search-box').addEventListener('keyup', (e) => {
  loadVideos(e.target.value);
})
loadVideos();
