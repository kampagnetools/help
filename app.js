function dashboardApp(){ return { activeApp:'utm' }; }

function utmBuilder(){
  return {
    baseUrl:'', channel:'', campaign:'', campaignType:'', content:'', utmCampaign:'', anchor:'', earmarkType:'no',
    links:[], versionCount:1, showNotification:false, notificationMessage:'',
    channelMap:{
      email:{source:'sfmc',medium:'email'},
      sms:{source:'sfmc',medium:'sms'},
      meta:{source:'meta',medium:'paid_social'},
      facebook:{source:'facebook',medium:'paid_social'},
      instagram:{source:'instagram',medium:'paid_social'},
      google_ads:{source:'google',medium:'cpc'},
      ms_ads:{source:'bing',medium:'cpc'}
    },
    channelChanged(){ this.campaignType=''; this.earmarkType='no'; this.campaign=''; },
    updateCampaignCode(){ const d={'feltpartner_nyhedsbrev':'2822','oneoff_nyhedsbrev':'2824'}; if(!this.campaignType) return; if(this.earmarkType==='yes'){ if(this.campaign===d[this.campaignType]) this.campaign=''; } else { this.campaign=d[this.campaignType]||''; } },
    generateLinks(){
      if(!this.baseUrl){ this.notify('Indtast en gyldig basis-URL'); return; }
      if(!this.campaignType){ this.notify('Vælg kampagnetype'); return; }
      this.updateCampaignCode(); this.links=[];
      for(let v=1;v<=this.versionCount;v++){
        let ci = this.content ? this.content + (this.versionCount>1 ? '_v'+v : '') : undefined;
        const {source:utm_source, medium:utm_medium} = this.channelMap[this.channel]||{source:'',medium:''};
        const params={utm_source,utm_medium,utm_campaign:this.utmCampaign||this.campaign||'default',utm_content:ci};
        let url=new URL(/^https?:\/\//i.test(this.baseUrl)?this.baseUrl:'https://'+this.baseUrl);
        Object.entries(params).forEach(([k,v])=>v && url.searchParams.set(k,v));
        if(this.anchor) url.hash=this.anchor;
        this.links.push({...params, url:url.toString(), anchor:this.anchor||'', statusText:'✅ OK', statusClass:'status-ok'});
      }
      this.notify('Links genereret!');
    },
    copy(u){navigator.clipboard.writeText(u); this.notify('Kopieret!');},
    copyAll(){navigator.clipboard.writeText(this.links.map(l=>l.url).join('\n')); this.notify('Alle links kopieret!');},
    open(u){window.open(u,'_blank');},
    notify(msg){ this.notificationMessage=msg; this.showNotification=true; setTimeout(()=>this.showNotification=false,2500);}
  };
}

function smsCounter(){
  return {
    text:'', 
    get charCount(){ return this.text.length; },
    get smsCount(){ return this.text.length===0?0:this.text.length<=160?1:Math.ceil(this.text.length/153);}
  };
}

function utmExtractor(){
  return {
    inputUrl:'', utmParams:[], showNotification:false, notificationMessage:'',
    extractUTM(){
      if(!this.inputUrl){ this.notify('Indsæt en gyldig URL'); return; }
      try{
        const u=new URL(this.inputUrl), p=[];
        u.searchParams.forEach((v,k)=>{ if(k.startsWith('utm_')) p.push({key:k,value:v}); });
        this.utmParams = p.length?p:[{key:'Ingen UTM parametre', value:'-'}];
        this.notify('UTM parametre hentet!');
      } catch(e){ this.notify('Ugyldig URL'); this.utmParams=[]; }
    },
    notify(msg){ this.notificationMessage=msg; this.showNotification=true; setTimeout(()=>this.showNotification=false,2500);}
  };
}
