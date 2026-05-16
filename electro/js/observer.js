(function () {
    // document.querySelectorAll('[data-animate]').forEach(item => {
    //     let animates = item.dataset.animate.split(' ');
    //     item.classList.add('animate__animated', ...animates);
    // })

    setTimeout(function (){
        const interSections = document.querySelectorAll('.inter-section');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // console.log('entry', entry);
                if (typeof getCurrentAnimationPreference === 'function' && !getCurrentAnimationPreference()) {
                    return;
                }

                if (entry.isIntersecting) {
                    // console.log('observer entry.isIntersecting');
                    entry.target.classList.add('inter-section_is-transition');
                    entry.target.querySelectorAll('[data-animate]').forEach(item => {
                        if(!item.classList.contains('animate__animated')){
                            let animates = item.dataset.animate.split(' ');
                            item.classList.add('animate__animated', ...animates);
                        }
                    })
                    return;
                }

                /*entry.target.querySelectorAll('[data-animate]').forEach(item => {
                    let animates = item.dataset.animate.split(' ');
                    item.classList.remove('animate__animated', ...animates)
                })*/
                entry.target.classList.remove('inter-section_is-transition');
            });
        });
        // console.log('observer', observer);
        // console.log('interSections', interSections.length);
        interSections.forEach(interSection => {
            observer.observe(interSection)
        });
    }, 0)

})();