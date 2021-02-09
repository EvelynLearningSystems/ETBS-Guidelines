function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                    if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                }
            };
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

function loadHTML(file) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                $('#main').html(this.responseText);

                // Katex
                renderKatex(document.getElementById('main'));

                // Code Highlighting
                document.querySelectorAll('pre code').forEach(function(block) {
                    renderCopyButton(block);

                    if (!block.classList.contains('plaintext')) {
                        hljs.highlightBlock(block);
                    }
                });

                //Scroll links
                $(".navlink").click(function() {
                    $('[name="' + $(this).attr('data-link') + '"]')[0].scrollIntoView();
                });

                //Code line numbers
                (function() {
                    var pre = document.getElementsByClassName('show_line_numbers'),
                        pl = pre.length;
                    for (var i = 0; i < pl; i++) {
                        pre[i].innerHTML = '<span class="line-number"></span>' + pre[i].innerHTML + '<span class="cl"></span>';
                        var num = pre[i].innerHTML.split(/\n/).length;
                        for (var j = 0; j < num; j++) {
                            var line_num = pre[i].getElementsByTagName('span')[0];
                            line_num.innerHTML += '<span>' + (j + 1) + '</span>';
                        }
                    }
                })();
            }
            if (this.status == 404) {$('#main').html('Page Not Found.');}
        }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
}
var hash = window.location.hash;
if (hash.length > 1) {
    hash = hash.substr(1);
    if (hash.indexOf('#') >= 0) {
        hash = hash.substring(0, hash.indexOf('#'))
    }
    loadHTML('content/' + hash + '.html');
} else {
    loadHTML('content/home.html');
}

//includeHTML();

function renderKatex(elem) {
    renderMathInElement(elem, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false}
        ],
        macros: {
            '\\longdivision': '#1\\overline{\\smash{)}#2}'
        }
    });
}

function renderCopyButton(element) {
    $('<button class="btn-clipboard" title="Copy to clipboard">Copy</button>')
        .insertBefore(element)
        .tooltip({ boundary: 'viewport' })
        .on('mouseleave', function() {
            $(this).tooltip('hide');
        })
        .on('click', function() {
            var range = document.createRange();
            var selection = window.getSelection();
            var success = false;
            var message;

            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);

            try {
                success = document.execCommand('copy');
            } catch (err) {}

            if (success) {
                message = 'Copied!';
            } else {
                var modifier = /Mac/i.test(navigator.userAgent) ? 'âŒ˜' : 'Ctrl-';
                message = 'Press ' + modifier + 'C to copy';
            }

            $(this)
                .attr('title', message)
                .tooltip('_fixTitle')
                .tooltip('show')
                .attr('title', 'Copy to clipboard')
                .tooltip('_fixTitle');
        });
}

//Katex
document.addEventListener("DOMContentLoaded", function() {
    renderKatex(document.body)
});

$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});