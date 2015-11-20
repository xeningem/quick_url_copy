// Saves options to localStorage.
function get_selector( id )
{
    var select = document.getElementById( id );
    var value = select.children[select.selectedIndex].value;
    return value;
}

function set_selector( id, favorite )
{
    var select = document.getElementById( id );

    for (var i = 0; i < select.children.length; i++) {
        var child = select.children[i];
        if (child.value == favorite) {
            child.selected = "true";
            break;
        }
    }
}

function save_option(id)
{
    localStorage["favorite_" + id ] = get_selector( id );
}

function load_option(id)
{
    var favorite = localStorage["favorite_" + id];
    if (!favorite) {
        return;
    }
    set_selector( id, favorite )
}

var options = ["ctrlKey", "altKey", "shiftKey", "whichKey"]

function save_options() {
    for (var i = 0; i < options.length; i++) {
        var id = options[i]
            // console.log("i:" + i + " = " + id )
            save_option(options[i])
    }
    localStorage["saved"] = true;

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    for (var i = 0; i < options.length; i++) {
        var id = options[i]
            // console.log("i:" + i + " = " + id )
            load_option(options[i])
    }

}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
