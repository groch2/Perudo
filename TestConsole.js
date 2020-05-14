const rl =
    require('readline')
        .createInterface({
            input: process.stdin,
            output: process.stdout
        });

(function loop(state) {
    rl.question(`${state} Continue ? (Yes = Y, y)`, answer => {
        console.log(answer);
        switch (answer) {
            case 'Y':
            case 'y':
                loop(state + 1);
                return;
            default:
                console.log('over');
                rl.close();
                return;
        }
    });
})(0);
