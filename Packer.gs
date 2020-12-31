const Packer = (()=>{
  // when we get a package back from the server it may or may not contain new data
  // if there's no new data, we user what we already have
  const reconstructEverything = ({ current, latest }) => {
    // best case is that the fingerprints are the same - then there's nothing to do
    if (!latest.changed) {
      current.changed = latest.changed;
      // also need to set each of the everythings to false rather than inheriting what they whether
      Object.keys(current.everything).forEach(
        (f) => (current.everything[f].changed = false)
      );
      return current;
    }

    // otherwise the latest needs to be he , with any skipped data being replaced by current
    const everything = Object.keys(latest.everything).reduce((p, c) => {
      const lob = latest.everything[c];
      const cob = current && current.everything && current.everything[c];
      p[c] = lob.changed ? lob : cob;
      // because next time it wont have changed, unless it has a new lob
      p[c].changed = lob.changed;
      return p;
    }, {});

    const np = {
      ...latest,
      everything
    };

    return np;
  };

  // all the sheet data is in the same format
  const getSet = (ds, name) => (ds && ds[name]) || {};

  // just get the data item
  const getData = (ds, name) => getSet(ds, name).data || null;

  // we only need to send a few things as a request to describe what we already have
  const slimCurrent = ({ current }) => {
    const everything =
      current && current.everything
        ? Object.keys(current.everything).reduce((p, c) => {
            p[c] = {
              fingerprint: current.everything[c].fingerprint
            };
            return p;
          }, {})
        : null;

    // this controls what we want the server to send back
    // the overall fingerprint is a summary of everything we know
    // each individual fingerprint describes what we know about each sheet
    const retPack = current && {
      id: current.id,
      fingerprint: current.fingerprint,
      everything,
      sheetNames: current.sheetNames
    };
    return retPack;
  };

  return {
    reconstructEverything,
    getSet,
    getData,
    slimCurrent
  }
})();


