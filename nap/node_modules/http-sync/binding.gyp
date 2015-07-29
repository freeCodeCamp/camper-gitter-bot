{
    'targets' : [
	{
	    'target_name' : 'curllib',
	    'sources' : [
		'curllib.cc'
	    ],
	    'libraries' : [
		'-lcurl'
	    ],
	    'include_dirs': [
		"<!(node -e \"require('nan')\")"
	    ],
	}
    ]
}
