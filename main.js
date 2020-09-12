// Usage
// 1) Open browser console (Ctrl+Shift+I)
// 2) Simply copy-paste it into browser console
// 3) Allow opening windows

if( typeof jQuery !== 'undefined' )
{
    // via: https://www.geeksforgeeks.org/how-to-open-url-in-new-tab-using-javascript/
    function OpenInNewTab(link) { 
        return window.open(link, "_blank"); 
    }

    function OpenLinkWithScript(link, script)
    {
        var win = OpenInNewTab(link);

        if(win === null || win['document'] === undefined) {
            console.log("OpenLinkWithScript document undefined!!!")
            return false;
        }

        var element = win.document.createElement('script');
        element.type      ='text/javascript';
        element.innerHTML = script
    
        setTimeout(function()
        {
            win.document.body.appendChild(element);
            console.log('New script injected!')

            // Pop-under not works
            // win.blur();
            // window.focus();
            
        }, 3000);

        return true;
    }

    // Always opened stream page contains prompt for opening in web version 
    function OpenLinkAndPressButton(link)
    {
        // On that page jquery not available
        var script = 
            "var element = document.getElementById(\'openTeamsClientInBrowser\');" +
            "element.click();"; // https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/click

        return OpenLinkWithScript(link, script);
    }

    // -----------------------------------------------------

    // via: https://stackoverflow.com/a/9323252/
    function removeLastWord(str) {
        return str.substring(0, str.lastIndexOf(" "));
    }

    function parseContent()
    {
        var all = $('.item-wrap.ts-message-list-item').map(function() // find all "item-wrap ts-message-list-item"
        {
            var element = this;

            var nick = $(element)
                        .find('.ts-msg-name.app-small-font') // "ts-msg-name app-small-font"
                        .text().trim();

            element = $(element)
                        .find('.message-body-content.clearfix.html'); // "message-body-content clearfix html"

            var message = $(element)
                        .children()
                        .children()
                        .children()
                        .text();

            var link = $(element)
                        .find('a')
                        .html();

            if(link !== undefined)
            {
                message = removeLastWord(message);
            }

            return {message, link, nick};
        }).get();

        // Remove items with empty "links"
        all = all.filter(function(item)
        {
            return (item.link);
        });

        return all;
    }

    // ------------------------------------------------------------

    var visited = new Set(); // Set, because it contains 'unique' visited links


    // On first launch mark everything as visited
    var content = parseContent();
    content.forEach(function(item) {
        visited.add(item.link);
    });

    console.log(content);

    // ------------------------------------------------------------    

    // Cyclic timer, which ticks every 5 seconds
    setInterval(function()
    {
        content = parseContent();

        // Retreive non-visited links
        var nonVisited = new Set();
        content.forEach(function(item)
        {
            var item_link = item.link;

            if( !visited.has( item_link ) ) {
                nonVisited.add( item_link );
            }
        });

        var idx = 0;
        nonVisited.forEach(function(link)
        {
            setTimeout(function()
            {
                if( !visited.has(link) ) // Important: If in future we already visited it - dont do anything
                {                
                    if( OpenLinkAndPressButton(link) ) // If link successfuly opened
                    {
                        visited.add(link); // Mark that link as visited
                        console.log("OPENED LINK: " + link);
                    }
                }
            }, (idx += 1) * 3000); // Open each non-visited link after 3 seconds each
        });

        // Print tick time
        var curr_time_str = new Date().toLocaleTimeString();
        console.log("TICK: " + curr_time_str);

    }, 5000);
    
}
