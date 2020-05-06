$().ready(function(){
    $.getJSON( "projects/projects.json", function( projects ) {
        var out = "";
        $.each(projects, function (index, project) {
            out += '<div class="card">';
            out += '<h5 class="card-header" style="background-color: black; color: white">' + project.name + '</h5>';
            out += '<table class="table table-hover" style="margin-bottom: 0"><tbody>';
            out += '<tr><th>Role</th><td><i>' +
                project.role + '</i>,<br>' +
                project.org + '</td></tr>';

            if (project.desc.length !== 0)
                out += '<tr><th>Description</th><td>' +
                    project.desc + '</td></tr>';


            out += '<tr><th>Language(s)</th><td>' +
                project.lang + '</td></tr>';

            if (project.tags.indexOf("Live") !== -1)
                out += '<tr><th><i class="fas fa-server fa-2x"></i></th><td>' +
                    '<a class="btn btn-primary btn-block" target="_blank" href="' +
                        project.src + '">View Live Website</a></td></tr>';

            else if (project.src.length !== 0)
                out += '<tr><th><i class="fas fa-code fa-2x"></i></th><td>' +
                    '<a class="btn btn-info btn-block" target="_blank" href="' +
                        project.src + '">View Source Code</a></td></tr>';

            out += '</tbody></table>';
            out += '</div>';
        });
        $('#projects').html(out);
    });
});