const aepsPermissionsList = [{
    value: "allAeps",
    label: "All AePS Services",
    children: [
        { value: 'aepsTransaction', label: 'AePS Transactions' },
        { value: 'aepsPayout', label: 'AePS Payouts' },
        { value: 'aepsReport', label: 'AePS Reports' },
    ]
}]

const bbpsPermissionsList = [{
    value: "allBbps",
    label: "All BBPS Services",
    children: [
        { value: 'bbpsTransaction', label: 'BBPS Transactions' },
        { value: 'bbpsReport', label: 'BBPS Reports' },
    ]
}]

const payoutPermissionsList = [{
    value: "allPayout",
    label: "All Payout Services",
    children: [
        { value: 'payoutTransaction', label: 'Payout Transactions' },
        { value: 'payoutReport', label: 'Payout Reports' },
    ]
}]

const dmtPermissionsList = [{
    value: "allDmt",
    label: "All DMT Services",
    children: [
        { value: 'dmtTransaction', label: 'DMT Transactions' },
        { value: 'dmtReport', label: 'DMT Reports' },
    ]
}]

const rechargePermissionsList = [{
    value: "allRecharge",
    label: "All Recharge Services",
    children: [
        { value: 'rechargeTransaction', label: 'Recharge Transactions' },
        { value: 'rechargeReport', label: 'Recharge Reports' },
    ]
}]

const panPermissionsList = [{
    value: "allPan",
    label: "All PAN Services",
    children: [
        { value: 'panTransaction', label: 'PAN Application' },
        { value: 'panReport', label: 'PAN Reports' },
    ]
}]

const licPermissionsList = [{
    value: "allLic",
    label: "All LIC Services",
    children: [
        { value: 'licTransaction', label: 'LIC Application' },
        { value: 'licReport', label: 'LIC Reports' },
    ]
}]

const cmsPermissionsList = [{
    value: "allCms",
    label: "All CMS Services",
    children: [
        { value: 'cmsTransaction', label: 'CMS Transactions' },
        { value: 'cmsReport', label: 'CMS Reports' },
    ]
}]

export {
    aepsPermissionsList,
    bbpsPermissionsList,
    payoutPermissionsList,
    dmtPermissionsList,
    rechargePermissionsList,
    panPermissionsList,
    licPermissionsList,
    cmsPermissionsList
}