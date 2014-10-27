// after model is parsed - init form handlers
__initFormHandlers = function () {

	// really write checked-attrs for checkboxes -> MASTER-BRANCH CANDIDATE
	rdform.on( 'click', 'input[type=checkbox]', function(){
		$(this).attr("checked", $(this).prop("checked"));

	});

	// really write textarea value to html
	rdform.on( 'change', 'textarea', function(){
		$(this).text( $(this).val() );
	});

	$("button[type=reset]").click(function() {
		location.reload();
	});

	// change isForename checkbox value to 1/0
	rdform.on("change", 'input:checkbox', function() {
		$(this).val( $(this).prop("checked") ? "1" : "0" );
	});

	// on change forename insert all forenames (rufname) into global input
	rdform.on("keyup change", 'div[typeof="cpm:Forename"]', function() {
		var forenames = "";
		
		rdform.find('div[typeof="cpm:Forename"]').each(function() {
			if ( $(this).find('input[name="cpm:isFirstName"]').prop("checked") ) {
				forenames += $(this).find('input[name="cpm:forename"]').val() + " ";
			}
		});

		forenames = forenames.trim();
		rdform.find('input[name="forenames"]').val( forenames );
		// trigger keyup handler to input
		rdform.find('input[name="forenames"]').trigger( "keyup" );

	});

	// big publication literal highlighting
	rdform.find('label:contains("Veröffentlichungen / Publikationen")').first().parent().before("<div class='rdform-hidden-group'><legend>Veröffentlichungen, Literatur, Sonstiges</legend></div>");	
}

// validate form-input on change value or on submit the form
__userInputValidation = function( property ) {

	// validate if cpm:from is a smaller date than cpm:to
	if ( $(property).attr("name") == "cpm:from" ) {
		var from = Date.parse( $(property).val() );
		var toEl = $(property).parentsUntil(".rdform-literal-group").parent().next().find('input[name="cpm:to"]');
		var to = Date.parse( toEl.val() );		
		if ( from >= to ) {
			return false;
		} else {
			if ( $(property).parentsUntil(".rdform-literal-group").parent().next().hasClass("has-error") ) {
				RDForm.userInputValidation( toEl );
			}
		}
	}
	else if ( $(property).attr("name") == "cpm:to" ) {
		var to = Date.parse( $(property).val() );
		var fromEl = $(property).parentsUntil(".rdform-literal-group").parent().prev().find('input[name="cpm:from"]');
		var from = Date.parse( fromEl.val() );		
		if ( from >= to ) {
			return false;
		} else {
			if ( $(property).parentsUntil(".rdform-literal-group").parent().prev().hasClass("has-error") ) {
				RDForm.userInputValidation( fromEl );
			}
		}
	}	

}

// after pressing the duplicate button
__afterDuplicateClass = function ( thisClass ) {
	
	if ( $(thisClass).attr("typeof").search(/cpm:Forename/) != -1 ) {
			var arguments = $(thisClass).attr("arguments");
			var index = $.parseJSON( arguments )['i'];
			$(thisClass).find('input[name="cpm:forename"]').attr( "placeholder" , index + ". Vorname");
	}
	
}

__createResult = function() {

	var forenames = "";
		
		rdform.find('div[typeof="cpm:Forename"]').each(function() {
			if ( $(this).find('input[name="cpm:isFirstName"]').prop("checked") ) {
				forenames += $(this).find('input[name="cpm:forename"]').val() + " ";
			}
		});
	forenames = forenames.trim();
	//var forenames = $(rdform).find('input[name="forenames"]').val();
	var surname = $(rdform).find('input[name="cpm:surname"]').val();
	var resource = forenames + " " + surname;

	resource = resource.replace(/ /gi,'_');
	resource = RDForm.getWebsafeString(resource);

	$("#rdform-prof-filename").val( resource );

}

// before creating the class properties from input values
__createResultClassProperty = function( propertyContainer ) {


	if ( $(propertyContainer).children("input").attr("name") == "pid" ) {

		//$(propertyContainer).children("input").val( Math.floor( Math.random() * 10 ) );
		createPID();
	}

}

// before generating the class object from input values and properties
__createClass = function ( thisClass ) {

	

	if ( $(thisClass).attr("typeof") == "cpm:Professor" ) {
		var label = $(thisClass).find('input[name="rdfs:label"]').first().val();
	}

}

/* own functions */

// generate unique prof id
createPID = function() {
	var forename = rdform.find('input[name="cpm:forename"]').val();
	var surname = rdform.find('input[name="cpm:surname"]').val();
	var birth = rdform.find('div[typeof="cpm:Birth"] input[name="cpm:date"]').val();

	// TODO: explode birth (-) sum parts lengths

	var pid = ( ( forename.length + surname.length ) % 90 ) + 10;
	rdform.find('input[name="pid"]').val( pid );
}