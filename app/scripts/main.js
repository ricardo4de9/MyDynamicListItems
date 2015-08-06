/**
 *  main.js 
 *  This is the custom js file containing the handling functions and objects
 *  for the web application (MyDynamicListItems)
 *  @author Ricardo Lunar
 *  @version 1.0.0
 *  @since 06-08-2015
 */



/**
 * IMPORTANT! Make sure to run project from a server (local at least) in order to
 * ensure appropriate behavior of this web application.
 * 
 * FIRST --> From the terminal, go to the current project directory and run the following command:
 *           $ grunt serve 
 *           This will start the local server (http://localhost:9000)
 *
 * This development was run using Yeoman to build project and Grunt to set up a local server.
 *
 * Bootstrap was the basis of all the HTML mark up design and this JS is used as the model
 * and controller. 
 *
 * For further information about this tool go to: http://yeoman.io/learning/
 */



// ----------------- VIEW HANDLING ----------------- 


/**
 * This block allows to set the bindings for the two buttons
 * of the web application. It runs right after the HTML document has
 * been loaded.
 */
$(document).ready(function() {
    
    // Bindings
    $("#addListItemBtn").click(addListItem);
    
    $("#removeLastBtn").click(removeLast);
    
    // Console object confirmation added for debugging purposes.
    if (typeof console == "undefined") {
        window.console = {
            log: function () {}
        };
    }
    
});


/**
 * Pushes the list item into view given the list item template
 * which is one of the attributes of the list item object.
 * It is only called after updating the controlling stack
 * with the new list item at the end of it.
 *
 */
function pushListItemIntoView(listItemTemplate) {
    var html = $("#container ul").html();
    html += listItemTemplate;
    $("#container ul").html(html);
}


/**
 * Removes the last element of the list in the view.
 * It is only called after the controlling stack has
 * been update. It's guaranteed to eliminate the last one.
 *
 */
function popListItemFromView() {
    $("#container ul li:last-child").remove();
}


/**
 * Updates list item counter after having modified the
 * object in the stack relative to such item.
 */
function updateListItemCounter(listItemID,counter) {
    $("#" + listItemID + " p").text(counter);
}


/**
 * Shows warning message with Bootstrap classes given a message text.
 */
function showWarning(message) {
    $("#alertPlaceholder").html("<div class='alert alert-warning'><a class='close' data-dismiss='alert'>&times;</a><strong>WARNING! </strong><span>"+message+"</span></div>");
}


/**
 * Refreshes view to dismiss warning message.
 */
function dismissWarning() {
    $("#alertPlaceholder").html("");
}



// ----------------- STACK HANDLING ---------------------


/**
 * listItemStack: stores the list items as they are added.
 * stackCount: keeps track of the changes in the stack preventing
 *             to calculate the size of the stack each time.
 */
var listItemStack = [];
var stackCount = 0;


/**
 * Adds a new element to the stack and updates the view
 */
function addListItem() {
    console.log("Adding list item "+stackCount);
    var item = new dynamicListItem(getListItemID(stackCount));
    listItemStack.push(item);
    stackCount += 1;
    
    // In case the user hasn't close a previously shown the warning box
    // after having clicked remove when there were no items to remove
    if (stackCount == 1) {
        dismissWarning();    
    }
    
    // Update view with new list item
    pushListItemIntoView(item.htmlTemplate);
}


/**
 * Removes a new element from the stack and updates the view
 */
function removeLast() {
    
    // Verify if there is at least one element to remove
    if (stackCount > 0) {
        listItemStack.pop();
        stackCount -= 1;
        console.log("Removing list item "+stackCount);
        
        // Update view after last item removal
        popListItemFromView();
        
    } else {
        showWarning("There are no more list items to remove");
    }
}



// ----------------- DYNAMIC LIST ITEM HANDLING ----------------- 


/**
 * OBJECT (created as a function)
 * An instance of this object is created each time a list item
 * is added to the stack.
 */
function dynamicListItem (listItemID) {
    this.id = listItemID;
    this.counter = 0;
    this.htmlTemplate = "<li id='" + listItemID + "' class='list-group-item clearfix'><span class='pull-right'><button type='button' class='btn btn-primary btn-sm' onclick='addOneToCounter(" + stackCount + ")'><span class='glyphicon glyphicon-plus'></span> Add one</button></span><p class='list-group-item-heading'>" + this.counter + "</p></li>";
    this.addOne = function() {
        this.counter += 1;
        updateListItemCounter(this.id,this.counter);
    }
}


/**
 * Adds one to the list item counter
 */
function addOneToCounter(index) {
    // Use addOne() function of the element at such index
    listItemStack[index].addOne();
}


/**
 * Function to generate and query for the ID of a list item.
 * @return a string containing the list item ID.
 */
function getListItemID(index) {
    return "listItem" + index;
}