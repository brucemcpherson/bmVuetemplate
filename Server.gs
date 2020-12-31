const Server = (() => {

  const getss = ({id}) => id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet()
    
  // open a sheet
  const getSheet = ({ id, sheetName}) => getss({id}).getSheetByName(sheetName)
  
  // open a fiddler and assign a sheet
  const getFiddler = ({ id, sheetName }) => {
    return new bmFiddler.Fiddler(getSheet({id, sheetName}))
  }
  
  // get a pack for a given fiddler
  const getPack  = ({fiddler}) => {
    const sheet = fiddler.getSheet()
    const pack = {
      name: sheet.getName(),
      id: sheet.getParent().getId(),
      sheetId: sheet.getSheetId()
    }
    
    pack.fingerprint = fiddler.getFingerprint()
    return pack
  }
  
  // simple way to clear a sheet and it's fiddler, but keep the headings intact
  const clearFiddler = (fiddler) => {
    return fiddler.filterRows(row=>false).dumpValues()
  }
  
  // this'll be called by Provoke polling
  const poller = ({current, id}) => {
    
    // might be interesting for the client
    const pollerStarted = new Date().getTime()
    
    // get all the fiddlers 
    const {sheetNames} = current
    
    // get fiddlers of every sheet
    const fiddlers = sheetNames
      .reduce ((p,sheetName)=> {
          p[sheetName] =  getFiddler({id, sheetName})
          return p
      }, {})
    
    // do some stuff to the data if necessry - assume there's a sheet called 'users' for example
    fiddlers.users.mapRows(row=> {
      // modify data here eg row.timeStamp = new Date().getTime()
      return row
    })
    
    // package up the current sheet contents
    const packs = sheetNames.reduce((p,sheetName) => {
      p.everything[sheetName] = getPack({fiddler: fiddlers[sheetName]})
      return p;
    }, {
      sheetNames,
      id,
      pollerStarted,
      everything: {}
    })

    // add the overall fingerprint 
    const fingerprints = Object.keys(packs.everything || []).map(f=>packs.everything[f].fingerprint)
    packs.fingerprint = fiddlers.users.fingerprinter(fingerprints)
    packs.changed = !current || packs.fingerprint !== current.fingerprint
   
    // if there's been any changes, then we need to enumerate which sheets have changed and provide the new data
    if (packs.changed) {
      const pe = packs.everything
      
      Object.keys(pe).forEach (f=> {
        const e = current && current.everything && current.everything[f]
        pe[f].changed = !e || e.fingerprint !== pe[f].fingerprint
        if(pe[f].changed) {
          pe[f].data = fiddlers[f].getData()
        }
      })
    }
    
    // dump out any fiddler changes
    Object.keys(fiddlers).forEach(f=>{
      if (fiddlers[f].isDirty()){
        fiddlers[f].dumpValues()
      }
    })
    
    // timestamp it
    packs.pollerFinished = new Date().getTime()
    return packs
  }

  return {
    poller
  }

})()

const testServer = () => {
  // can use this to test the poller server side just fiddle with the fingerprints to force getting updated packs
  const r = Server.poller({
    current: {
      fingerprint: 'QUoD9pecM78BPD8PyFY5KnNwJ3A=x',
      sheetNames: ["users"],
      everything:{
        users: {
          fingerprint: '8AiXogTJVJqhTLKRMCEI0Y9oe40='
        }
      }
    },
    id: '1yE_8t3MPt0vUoHen8szTv8VVf2i7M3SVBKiEdZktt2Q'
  })
  console.log(r)
}