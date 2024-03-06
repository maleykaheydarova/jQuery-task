$(document).ready(function () {
    var postsUrl = "https://jsonplaceholder.typicode.com/posts";
    var commentsUrl = "https://jsonplaceholder.typicode.com/comments";

    //Fetch posts from the API
    $.ajax({
        url: postsUrl,
        type: 'GET',
        success: function (posts) {
            posts.forEach(function (post) {
                var postRow = $("<tr>");
                postRow.append("<td>" + post.id + "</td>");
                postRow.append("<td>" + post.title + "</td>");

                // Replace body content with ... if it exceeds 30 characters
                var replaceBody = post.body.length > 30 ? post.body.substring(0, 30) + "..." : post.body;
                postRow.append("<td>" + replaceBody + "</td>");

                // Show loader while waiting for comments
                var commentsCell = $("<td>");
                commentsCell.append('<div class="loader"></div>');
                postRow.append(commentsCell);

                $("#postsBody").append(postRow);

                // Fetch comments for this post after a delay of 2 seconds
                setTimeout(function(){
                    $.ajax({
                        url: commentsUrl,
                        type: 'GET',
                        data: { postId: post.id },
                        success: function (comments) {
                            // Show only the first three comments
                            for (var i = 0; i < 3 && i < comments.length; i++) {
                                commentsCell.append("<p>" + comments[i].name + ": " + comments[i].body + "</p>");
                            }
                        },
                        error: function () {
                            // Handle error if the request fails
                            commentsCell.html("Error fetching comments.");
                        },
                        complete: function () {
                            // Remove loader when comments are loaded
                            commentsCell.find('.loader').remove();
                        }
                    });
                },2000);
                
            });
        },
        error: function () {
            // Handle error if the request fails
            $("#postsBody").html("<tr><td colspan='4'>Error fetching posts.</td></tr>");
        }
    });
});

