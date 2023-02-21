const salaries = {
    Manager: { salary: 1000, tax: "10%" },
    Designer: { salary: 600, tax: "30%" },
    Artist: { salary: 1500, tax: "15%" },
};


const team = [
    { name: "Misha", specialization: "Manager" },
    { name: "Max", specialization: "Designer" },
    { name: "Vova", specialization: "Designer" },
    { name: "Leo", specialization: "Artist" },
];


function calculateTeamFinanceReport(salaries, team) {
    let resultObj = { totalBudgetTeam: 0 };


    for (let key in salaries) {
        const newKey = "totalBudget" + key;
        resultObj[newKey] = 0;
    }


    team.map(item => {
        for (let itemSalary in salaries) {
            if (item.specialization === itemSalary) {
                for (let key in resultObj) {
                    if (key.indexOf(itemSalary) !== -1) {
                        const formattedTax = +salaries[itemSalary].tax.replace("%", "");
                        resultObj[key] += Math.trunc(
                            salaries[itemSalary].salary + (salaries[itemSalary].salary / 100) * formattedTax
                        );
                        resultObj.totalBudgetTeam += Math.trunc(
                            salaries[itemSalary].salary + (salaries[itemSalary].salary / 100) * formattedTax
                        );
                    }
                }
            }
        }
    });
    console.log(resultObj);
    return resultObj;
}


calculateTeamFinanceReport(salaries, team);

