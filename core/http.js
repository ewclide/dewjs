export class HTTP
{
	constructor()
	{
		
	}

	get(path)
	{
		var self = this,
			async = new $Async(),
			request = new XMLHttpRequest();

		request.open("GET", path, true);
		request.send();
		request.onreadystatechange = function()
		{
			if (request.readyState == 4)
			{
				if (request.status == 200)
					async.run.success(request.responseText);
				
				else log.err(this.status ? this.statusText : 'ajax send error');
			}
		}

		return async;
	}

	post(data)
	{
		var self = this,
			request,
			formData;

		if (data)
		{
			formData = new FormData();

			for (var key in data)
				formData.append(key, data[key]);
		}
		else log.err("http.post must have some data!");

		return {
			to : function(path)
			{
				if (path)
				{
					request = new XMLHttpRequest();
					request.open("POST", path, true);
					request.send(formData);

					var async = new $Async();

					request.onreadystatechange = function()
					{
						if (request.readyState == 4)
						{
							if (request.status == 200)
								async.run.success(request.responseText);

							else
							{
								async.run.fail(request.statusText);
								log.err("http.send ajax error (" + request.status + "): " + request.statusText);
							}
						}
					}

					return async;
				}
				else log.err("http.post must have some path!");
			}
		}
	}
}