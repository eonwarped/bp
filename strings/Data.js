

const strings = {

  dataExplination: ()=> {
    return `
--------------------------------
          How to Data ?
--------------------------------
With data you will be able to
extract and display information
on the blockchain direcly on chat.
To use this feature type [ Data ]
including one of the following tags.
--------------------------------
    Available Search Items
--------------------------------
[Tag] | [User] | [CreateKey]
[Activewitness] | [Delegation]
--------------------------------
    More will follow soon !
--------------------------------
`
},

  dataErrorDelegator: ()=> {
    return `
--------------------------------
ERROR: [ Delegation from who ? ]
USAGE: [ Data User fromName toName ]
--------------------------------`
},

dataErrorDelegatee: ()=> {
  return `
--------------------------------
ERROR: [ Delegation to who ? ]
USAGE: [ Data User fromName toName ]
--------------------------------`
},

  dataErrorNoDelegations: (from, to)=> {
    return `
------------------------------------
[ No Delegations from this account ]
------------------------------------
     The account [@${from}] has
    nothing delegated to [@${to}].
------------------------------------
`
},

  dataErrorTag: ()=> {
    return `
--------------------------------
ERROR: [ Please Define a tag ! ]
USAGE: [ Data Tag Kittens ]
--------------------------------
`
},

  dataErrorNoAcc: ()=> {
    return `
--------------------------------
ERROR: [ Please Define a Name ! ]
USAGE: [ Data User Moonbot ]
--------------------------------`
},

  dataActiveWitness: (output)=> {
    return `
--------------------------------
  [ Recent Active Witnesess ]
--------------------------------
${output}
--------------------------------`
  }
}

module.exports = strings;
