function toggleFlag() {
    const flagButton = event.currentTarget;
    const flagImage = flagButton.children[0];

    if (flagImage.src.includes('emptyFlag.png')) {
        flagImage.src = '/images/markedFlag.png';
    } else {
        flagImage.src = '/images/emptyFlag.png';
    }

    // fetch('/flag', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ userId: userId, postId: postId }),
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
}
function toggleLike(event) {
    const likeButton = event.currentTarget;
    const likeImage = likeButton.querySelector('img');
    const postId = likeButton.querySelector('input[name="postId"]').value;
    const liked = likeButton.querySelector('input[name="liked"]').value === 'true';
    let likeCount = parseInt(likeButton.querySelector('input[name="likeCount"]').value);

    if (likeImage.src.includes('likeUnclicked.png')) {
        likeImage.src = '/images/likeClicked.png';
        likeCount++;

    } else {
        likeImage.src = '/images/likeUnclicked.png';
        likeCount--;
    }

    likeButton.querySelector('input[name="likeCount"]').value = likeCount;
    const likeCountElement = likeButton.nextElementSibling;
    likeCountElement.textContent = `${likeCount} likes`; 
    
    fetch('/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postId }),
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function toggleView(view) {
    const postsContent = document.getElementById('feed-content');
    const resourcesContent = document.getElementById('resources-content');
    if (view === 'posts') {
        postsContent.style.display = 'block';
        resourcesContent.style.display = 'none';
    } else {
        postsContent.style.display = 'none';
        resourcesContent.style.display = 'block';
    }
    if (view === 'resources') {
        document.getElementById('postButton').style.display = 'none';
    } else {
        document.getElementById('postButton').style.display = 'block';
    }
}

function toggleAccountView(view){
    const accountPosts = document.getElementById('posts');
    const accountReviews = document.getElementById('reviews');
    if (view === 'posts'){
        accountPosts.style.display = 'block';
        accountReviews.style.display = 'none';
    } else {
        accountPosts.style.display = 'none';
        accountReviews.style.display = 'block';
    }
}