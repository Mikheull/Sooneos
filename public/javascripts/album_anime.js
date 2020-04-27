$( document ).ready(function() {
	setTimeout(function(){
		$('#loader').remove();
		$('#content .grid').show();
	}, 3000);
});


/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */


{
    class Details {
        constructor() {
            this.DOM = {};

            const detailsTmpl = `
				<div class="details__bg details__bg--up bg-gray-100 h-screen top-0"></div>
				<div class="details__bg details__bg--down bg-gray-200"></div>
				<img class="details__img" src="" alt="img 01"/>
				<h2 class="details__title text-6xl font-extrabold"></h2>
				<h3 class="details__subtitle text-3xl font-semibold text-gray-700"></h3>
				<p class="details__description"></p>
				<button class="details__close"><i class="fa text-xl fa-times"></i></button>
            `;

            this.DOM.details = document.createElement('div');
            this.DOM.details.className = 'details';
            this.DOM.details.innerHTML = detailsTmpl;
            DOM.content.appendChild(this.DOM.details);
            this.init();
        }
        init() {
            this.DOM.bgUp = this.DOM.details.querySelector('.details__bg--up');
            this.DOM.bgDown = this.DOM.details.querySelector('.details__bg--down');
            this.DOM.img = this.DOM.details.querySelector('.details__img');
            this.DOM.title = this.DOM.details.querySelector('.details__title');
            this.DOM.subtitle = this.DOM.details.querySelector('.details__subtitle');
            this.DOM.description = this.DOM.details.querySelector('.details__description');
            this.DOM.close = this.DOM.details.querySelector('.details__close');

            this.initEvents();
        }
        initEvents() {
            this.DOM.close.addEventListener('click', () => this.close());
        }
        fill(info) {
            this.DOM.img.src = info.img;
            this.DOM.title.innerHTML = info.title;
            this.DOM.subtitle.innerHTML = info.subtitle;
            this.DOM.description.innerHTML = info.description;
        }
        getProductDetailsRect() {
            return {
                albumBgRect: this.DOM.albumBg.getBoundingClientRect(),
                detailsBgRect: this.DOM.bgDown.getBoundingClientRect(),
                albumImgRect: this.DOM.albumImg.getBoundingClientRect(),
                detailsImgRect: this.DOM.img.getBoundingClientRect()
            };
        }
        open(data) {
			$('.details__bg--down').css('height', '100%');
			$('.music').attr('style', 'display: block !important');

            if ( this.isAnimating ) return false;
            this.isAnimating = true;

            this.DOM.details.classList.add('details--open');

            this.DOM.albumBg = data.albumBg;
            this.DOM.albumImg = data.albumImg;

            this.DOM.albumBg.style.opacity = 0;
            this.DOM.albumImg.style.opacity = 0;

            const rect = this.getProductDetailsRect();

            this.DOM.bgDown.style.transform = `translateX(${rect.albumBgRect.left-rect.detailsBgRect.left}px) translateY(${rect.albumBgRect.top-rect.detailsBgRect.top}px) scaleX(${rect.albumBgRect.width/rect.detailsBgRect.width}) scaleY(${rect.albumBgRect.height/rect.detailsBgRect.height})`;
            this.DOM.bgDown.style.opacity = 1;

            this.DOM.img.style.transform = `translateX(${rect.albumImgRect.left-rect.detailsImgRect.left}px) translateY(${rect.albumImgRect.top-rect.detailsImgRect.top}px) scaleX(${rect.albumImgRect.width/rect.detailsImgRect.width}) scaleY(${rect.albumImgRect.height/rect.detailsImgRect.height})`;
			this.DOM.img.style.opacity = 1;
			$( ".rg_embed" ).show();

            anime({
                targets: [this.DOM.bgDown,this.DOM.img],
                duration: (target, index) => index ? 800 : 250,
                easing: (target, index) => index ? 'easeOutElastic' : 'easeOutSine',
                elasticity: 250,
                translateX: 0,
                translateY: 0,
                scaleX: 1,
                scaleY: 1,
                complete: () => this.isAnimating = false
            });

            anime({
                targets: [this.DOM.title, this.DOM.subtitle, this.DOM.description],
                duration: 600,
                easing: 'easeOutExpo',
                delay: (target, index) => {
                    return index*60;
                },
                translateY: (target, index, total) => {
                    return index !== total - 1 ? [50,0] : 0;
                },
                scale:  (target, index, total) => {
                    return index === total - 1 ? [0,1] : 1;
                },
                opacity: 1
            });

            anime({
                targets: this.DOM.bgUp,
                duration: 100,
                easing: 'linear',
                opacity: 1
            });

            anime({
                targets: this.DOM.close,
                duration: 250,
                easing: 'easeOutSine',
                translateY: ['100%',0],
                opacity: 1
            });
        }
        close() {
			$('.details__bg--down').css('height', '');
			$('.music').attr('style', 'display: none !important');

            if ( this.isAnimating ) return false;
            this.isAnimating = true;

            this.DOM.details.classList.remove('details--open');
			$( ".rg_embed" ).hide();

            anime({
                targets: this.DOM.close,
                duration: 250,
                easing: 'easeOutSine',
                translateY: '100%',
                opacity: 0
            });

            anime({
                targets: this.DOM.bgUp,
                duration: 100,
                easing: 'linear',
                opacity: 0
            });

            anime({
                targets: [this.DOM.title, this.DOM.subtitle, this.DOM.description],
                duration: 20,
                easing: 'linear',
                opacity: 0
            });

            const rect = this.getProductDetailsRect();
            anime({
                targets: [this.DOM.bgDown,this.DOM.img],
                duration: 250,
                easing: 'easeOutSine',
                translateX: (target, index) => {
                    return index ? rect.albumImgRect.left-rect.detailsImgRect.left : rect.albumBgRect.left-rect.detailsBgRect.left;
                },
                translateY: (target, index) => {
                    return index ? rect.albumImgRect.top-rect.detailsImgRect.top : rect.albumBgRect.top-rect.detailsBgRect.top;
                },
                scaleX: (target, index) => {
                    return index ? rect.albumImgRect.width/rect.detailsImgRect.width : rect.albumBgRect.width/rect.detailsBgRect.width;
                },
                scaleY: (target, index) => {
                    return index ? rect.albumImgRect.height/rect.detailsImgRect.height : rect.albumBgRect.height/rect.detailsBgRect.height;
                },
                complete: () => {
                    this.DOM.bgDown.style.opacity = 0;
                    this.DOM.img.style.opacity = 0;
                    this.DOM.bgDown.style.transform = 'none';
                    this.DOM.img.style.transform = 'none';
                    this.DOM.albumBg.style.opacity = 1;
                    this.DOM.albumImg.style.opacity = 1;
                    this.isAnimating = false;
                }
            });
        }
    };

    class Item {
		constructor(el) {
			this.DOM = {};
            this.DOM.el = el;
            this.DOM.album = this.DOM.el.querySelector('.album');
            this.DOM.albumBg = this.DOM.album.querySelector('.album__bg');
            this.DOM.albumImg = this.DOM.album.querySelector('.album__img');

            this.info = {
                img: this.DOM.albumImg.src,
                title: this.DOM.album.querySelector('.album__title').innerHTML,
                subtitle: this.DOM.album.querySelector('.album__subtitle').innerHTML,
                description: this.DOM.album.querySelector('.album__description').innerHTML
            };

			this.initEvents();
		}
        initEvents() {
            this.DOM.album.addEventListener('click', () => this.open());
        }
        open() {
            DOM.details.fill(this.info);
            DOM.details.open({
                albumBg: this.DOM.albumBg,
                albumImg: this.DOM.albumImg
            });
        }
    };

	// new Item( document.querySelector('.item') )

    const DOM = {};
    DOM.grid = document.querySelector('.grid');

    DOM.content = DOM.grid.parentNode;
    DOM.gridItems = Array.from(DOM.grid.querySelectorAll('.grid__item'));
    let items = [];
    DOM.gridItems.forEach(item => items.push(new Item(item)));

    DOM.details = new Details();
};
