
var baseUrl = "http://localhost:8081/iplstats/api";
google.charts.load('current', { 'packages': ['corechart'] });
showTeamLabels();

function showTeamLabels(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(`${baseUrl}/stats/team-names`, requestOptions)
      .then(response => response.json())
      .then(result => {
            let str = "<select class='form-select' onchange='showPlayers(event)'><option>Select Team</option>";
            for(let i=0;i<result.length;i++){
                let teamLabel = result[i];
                str +=`<option value=${teamLabel} '>${teamLabel}</option>`;
            }
            str +="</select>";
            document.querySelector("#teamDetails").innerHTML = str;               
           
      })
      .catch(error => console.log('error', error));
}
function showPlayers(event){
    let teamName = event.target.value;
    if(teamName !== ""){
        showPlayerCount(teamName);
        fetch(`${baseUrl}/stats/${teamName}/players`)
        .then(reponse=>reponse.json())
        .then(result =>{
            let str = `
            <table class="table mt-3 table-sm">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Country</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>`

                for(let i=0;i<result.length;i++){
                    let player = result[i];
                    str += `
                    <tr>
                        <td>${player.name}</td>
                        <td>${player.role}</td>
                        <td>${player.country}</td>
                        <td>${player.amount}</td>
                    </tr>    
                    `;
                }
                str +=`</tbody></table>`;
                document.querySelector("#playerDetails").innerHTML = str;
        });
    }
}

google.charts.setOnLoadCallback(teamAmountStat);

function showPlayerCount(team) {
   fetch(`${baseUrl}/stats/team-role-amounts`)
    .then(response => response.json())
    .then(result => {
            let inputData = [['Role','Count']]
            for(let i=0;i<result.length;i++){
                let ele = result[i];
                if(ele.team == team){
                    inputData.push([ele.role,ele.count]);
                }
            }
    var data = google.visualization.arrayToDataTable(inputData);
    var options = {
        title: `Role count stats ${team}`
    };
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
    });
}

function teamAmountStat() {
    let inputData =[
        ['TeamName', 'Amount']
    ];
    fetch(`${baseUrl}/stats/team-stats`)
    .then(response => response.json())
    .then(result => {
        for(let i=0;i<result.length;i++){
            let teamStats = result[i];
            let ele = [teamStats.team,teamStats.totalAmount];
            inputData.push(ele);
        }
        var data = google.visualization.arrayToDataTable(inputData);
        var options = {
            title: 'Team Amount Stats'
        };
        var chart = new google.visualization.ColumnChart(document.getElementById('colchart'));
        chart.draw(data, options);
    });
 
}
