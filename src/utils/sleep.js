module.exports = (delay = 0) => {
    console.log(`sleep - Sleep of ${delay} milliseconds...`);
    return new Promise(a => {
        console.log(`sleep - Sleep done!`);
        setTimeout(a, delay);
    });
}
