const login = document.getElementById("login_window") 
const start = document.getElementById("start_button")
const leader = document.getElementById("leader_button")

start.addEventListener("click", async () => 
{
    const nickname = login.value
    const processedNickname = nickname.replace(/[.,\/#$%\^&\*;:{}=\-`~!?]/g,"")
    if (!nickname || processedNickname != nickname ) 
    {
        alert("Error name!")
        return
    }

    localStorage.setItem('tmp_user_name', nickname)

    
    window.location.href = 'game.html'

})

leader.addEventListener("click", async () => 
{
    window.location.href = 'leader.html'
})