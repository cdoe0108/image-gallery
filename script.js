
window.addEventListener('load', function (e) {
    const API_KEY = 'bVC16ytz_mTpY-ciVtOcC05UY1azohb5s9bDb2LUSMY'
    let pgNo = 1
    const galleryEle = document.getElementById('gallery')
    const searchInput = document.getElementById('search-input')
    const noResult = document.getElementById('no-result')
    //API to get images
    const getImages = (pageNo, value) => {
        let url = `https://api.unsplash.com/photos?page=${pageNo}&per_page=10&client_id=${API_KEY}`
        if(value.length > 0 ){
            url = `https://api.unsplash.com/search/photos?query=${value}&page=${pgNo}&client_id=${API_KEY}`
        }
        
        fetch(url).then(res => res.json()).then(result => {
            // console.log('Success:', result);
            if(pgNo === 1){
                galleryEle.innerHTML = ''
            }
            if(value.length > 0) {result = result.results}
            noResult.style.display = (result.length <= 0) ? 'block' : 'none'
            result.map(item => renderImageContainer(item))
            pgNo++;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // get inital set of images
    getImages(pgNo, '')

    // Detect when scrolled to bottom.
    galleryEle.addEventListener('scroll', function () {
        if (galleryEle.scrollTop + galleryEle.clientHeight >= galleryEle.scrollHeight) {
            searchInput.value.length > 0 ? getImages(pgNo, searchInput.value) : getImages(pgNo, '');
        }
    });


    const renderImageContainer = (item) => {
        // image container here
        let imageContainer = document.createElement('div')
        imageContainer.classList.add('image-container')

        // overlay here
        let overlay = document.createElement('div')
        overlay.classList.add('overlay')
        overlay.setAttribute('id', `overlay-${item.id}`)

        // overlay btn here
        let btnContainer = document.createElement('div')
        btnContainer.classList.add('btn-container')
    
        let zoominBtn = document.createElement('button')
        zoominBtn.textContent = 'Zoom-in'
        zoominBtn.classList.add('btn')
        zoominBtn.onclick = () => {
            zoomin(item)
        }

        let zoomoutBtn = document.createElement('button')
        zoomoutBtn.textContent = 'Zoom-out'
        zoomoutBtn.classList.add('btn')
        zoomoutBtn.onclick = () => {
            zoomout(item)
        }
    
        let likeBtn = document.createElement('button')
        const likedPhotos = JSON.parse(localStorage.getItem('photos'))
        if (likedPhotos && Object.keys(likedPhotos).includes(item.id)){
            likeBtn.textContent = likedPhotos[item.id] ? 'Unlike' : 'Like'
        } else {
            likeBtn.textContent = 'Like'
        }
        likeBtn.setAttribute('id',`like-btn-${item.id}`)
        likeBtn.classList.add('btn')
        likeBtn.onclick = () => {
            likePhoto(item)
        }
        btnContainer.appendChild(zoominBtn)
        btnContainer.appendChild(zoomoutBtn)
        btnContainer.appendChild(likeBtn)
        overlay.appendChild(btnContainer)
        
        // image here
        let imageEle = document.createElement('img')
        imageEle.setAttribute('src', item.urls.small)
        imageEle.setAttribute('id', item.id)
        imageEle.classList.add('image')
        imageEle.onclick = () => {
            clickImage(item)
        }

        imageContainer.appendChild(imageEle)
        imageContainer.appendChild(overlay)
        galleryEle.appendChild(imageContainer)
    }

    const searchImage = (event) => {
        const { value } = event.target
        if (value.length <= 0) {
            getImages(pgNo,'')
        } else {
            pgNo = 1
            getImages(pgNo,value)
        }
    }

    searchInput.addEventListener('change', searchImage)


    const clickImage = img => {
        document.querySelectorAll('.overlay').forEach(function (el) {
            el.style.display = 'none';
        });
        const imgOverlay = document.getElementById(`overlay-${img.id}`)
        imgOverlay.style.display = "flex"
    }

    const zoomin = img => {
        var GFG = document.getElementById(img.id);
        var currWidth = GFG.clientWidth;
        GFG.style.width = (currWidth + 100) + "px";
        var currHeight = GFG.clientHeight;
        GFG.style.height = (currHeight + 50) + "px";
    }

    const zoomout = img => {
        var GFG = document.getElementById(img.id);
        var currWidth = GFG.clientWidth;
        GFG.style.width = (currWidth - 100) + "px";
        var currHeight = GFG.clientHeight;
        GFG.style.height = (currHeight - 50) + "px";
    }

    const likePhoto = img => {
        let likedPhotos = JSON.parse(localStorage.getItem('photos')) || {}
        if (Object.keys(likedPhotos).includes(img.id)){
            likedPhotos = {
                ...likedPhotos,
                [img.id]: !likedPhotos[img.id]
            }
        } else {
            likedPhotos = {
                ...likedPhotos,
                [img.id]: true
            }
        }
        document.getElementById(`like-btn-${img.id}`).textContent = likedPhotos[img.id] ? 'Unlike' : 'Like'
        localStorage.setItem('photos', JSON.stringify(likedPhotos))
    }

});