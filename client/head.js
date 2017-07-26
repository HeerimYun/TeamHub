Template.head.events({
    'click #btnTest': function (evt, tmpl) {
        var rslt = HTTP.call('POST', 'http://localhost:3000/test', {
            "headers": {'Content-Type': 'application/json'},
            "data": {
                id: 'heerim',
                pw: '1234'
            }
        }, function (err, rslt)  {
            alert(rslt)
        });

    }
});