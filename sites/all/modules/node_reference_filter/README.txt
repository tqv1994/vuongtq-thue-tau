The Nodereference filter module will add a new admin section to manage 
node autocomplete filtering options per nodereference auto complete field, 
per node type.
This module will overwrite the ajax request and give the ability to apply 
filtering options when searching for a node in the autocomplete field.

Install
-------
Installing the module is simple:

1) Copy the nodereference_filter folder to the modules folder in your 
   installation.

2) Enable the module using Administer -> Modules (#overlay=admin/modules)

GUIDE
-----

1) Setting additional field options:
	- on the screen #overlay=admin/config/content/nodereference_settings
		- will display all node reference autocomplete field, if the same field
		  is used on multiple node types, the field will be displayed for each
		  node type it appears in. This is because the settings for the field
		  can be defined differently per node type
	- description of options available on field settings screen
		- apply filter - enable additional filtering for field
		- node types - defined available node types, this list will only
		  contain node types defined in the node type field definition
	- reset to default - this will remove all settings defined for additional
	  filtering and disable additional filtering for the field
	  
2) Using additional filtering options:
	- in node edit form, if the field has active additional filtering options a
	  help item will be added below the field that will describe the available
	  filtering optons. Here is an overview of what can be available
	- [start] - this option is used to match only the start of the node title
	            with the search term
	- [T:node_type] - this option is used to restrict results to a specific 
	                  node type, must be defined as an available node type for
	                  the field
	- By node id - to search for a node id, enter the search term as the 
	               node id
	
E.G. - By text
	term[start][T:page]
	
E.G. - By node id
	123456[T:page]
	* filter options are not really needed for a node id search
