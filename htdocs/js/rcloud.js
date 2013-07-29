rcloud = {};

rcloud.init_client_side_data = function()
{
    var that = this;
    rclient.send_and_callback("rcloud.prefix.uuid()", function(data) {
        that.wplot_uuid = data;
    });
};

rcloud.username = function()
{
    return $.cookies.get('user');
};

rcloud.github_token = function()
{
    return $.cookies.get('token');
};

rcloud.search = function(search_string, k)
{
    var that = this;
    if (_.isUndefined(k)) k = _.identity;
    rclient.send_and_callback(
        rclient.r_funcall("rcloud.search", search_string), k);
};

rcloud.load_user_config = function(user, k)
{
    if (_.isUndefined(k)) k = _.identity;
    rclient.send_and_callback(
        rclient.r_funcall("rcloud.load.user.config", user), function(result) {
            k && k(JSON.parse(result));
        });
};

rcloud.load_multiple_user_configs = function(users, k)
{
    rclient.send_and_callback(
        rclient.r_funcall("rcloud.load.multiple.user.configs", users), function(result) {
            k && k(JSON.parse(result));
        });
};


rcloud.save_user_config = function(user, content, k)
{
    if (_.isUndefined(k)) k = _.identity;
    rclient.send_and_callback(
        rclient.r_funcall("rcloud.save.user.config", user,
                          JSON.stringify(content)),
        function(result) {
            k && k(JSON.parse(result));
        });
};

function rcloud_github_handler(command, k) {
    return function(result) {
        if(result.succeeded)
            k && k(result.content);
        else
            rclient.post_error(command + ': ' + result.content.message);
    };
}

rcloud.load_notebook = function(id, k)
{
    rclient.send_and_callback(
        rclient.r_funcall("rcloud.get.notebook", id),
        rcloud_github_handler("rcloud.get.notebook " + id, k)
    );
};

rcloud.update_notebook = function(id, content, k)
{
    rclient.send_and_callback(
        rclient.r_funcall("rcloud.update.notebook", id, JSON.stringify(content)),
        rcloud_github_handler("rcloud.update.notebook", k)
    );
};

rcloud.create_notebook = function(content, k)
{
    rclient.send_and_callback(
        rclient.r_funcall("rcloud.create.notebook", JSON.stringify(content)),
        rcloud_github_handler("rcloud.create.notebook", k)
    );
};

rcloud.resolve_deferred_result = function(uuid, k)
{
    var cmd = rclient.r_funcall("rcloud.fetch.deferred.result", uuid);
    rclient.send_and_callback(cmd, k);
};

rcloud.get_users = function(k)
{
    rclient.send_and_callback(
        rclient.r_funcall("rcloud.get.users"),
        rcloud_github_handler("rcloud.get.users", k)
    );
};

rcloud.rename_notebook = function(id, new_name, k)
{
    rclient.send_and_callback(
        rclient.r_funcall("rcloud.rename.notebook", id, new_name),
        rcloud_github_handler("rcloud.rename.notebook", k)
    );
};
