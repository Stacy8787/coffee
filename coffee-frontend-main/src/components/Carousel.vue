<template>
  <div id="carousel" class="carousel carousel-white slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active" data-bs-interval="10000">
        <img src="/img3.jpg" class="d-block w-100" >
        <div class="carousel-caption d-none d-md-block">
          <h5>Уютная атмосфера</h5>
        </div>
      </div>
      <div class="carousel-item" data-bs-interval="2000">
        <img src="/img2.jpg" class="d-block w-100" >
        <div class="carousel-caption d-none d-md-block">
          <h5>Потрясающий кофе</h5>
        </div>
      </div>
      <div class="carousel-item">
        <img src="/img1.jpg" class="d-block w-100" >
        <div class="carousel-caption d-none d-md-block">
          <h5>Проведите это время вместе</h5>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Предыдущий</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Следующий</span>
    </button>
  </div>
</template>
<style lang="scss">
.carousel-item {
  img {
    height: calc(100vh - 56px);
    object-fit: cover;
  }
}
</style>