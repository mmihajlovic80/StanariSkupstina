$(document).ready(() => {
    $('form').on('submit', (event) => {
        event.preventDefault();

        var poruka = $('#poruka');
    
        var todo = {
            poruka : poruka.val(),
           
        };

        $.ajax({
            type: 'POST',
            url: '/todo',
            data: todo,
            success: location.reload()
        });
        return false;
    });

   
    $('td').on('click', (e) => {


        let poruka = (e.target.innerText).replace(/\s/g, "-"); //svaki space zameniti crticom, dA BI NAM BILO LAKSE POREDJENJE


        $.ajax({
            type: 'DELETE',
            url: '/todo/' + poruka,
            success: location.reload()

        });
    });
});