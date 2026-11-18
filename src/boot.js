/* ===================== boot ===================== */
applyLang();renderHome();
try{const m=localStorage.getItem("sains-mode");if(m)setMode(m,true)}catch(e){}
go(location.hash.slice(1)||"signin");
