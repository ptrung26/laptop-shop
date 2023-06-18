const formatMoney = (val) => {
    if (!val) {
        return;
    }
    return val.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}

export default formatMoney; 