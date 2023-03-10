$(document).ready(function (){
  $(".brand-text").html('QUẢN LÝ DANH MỤC')
  if ($('.delimiter-mask').length) {
    new Cleave($('.delimiter-mask'), {
      delimiter: '.',
      uppercase: true
    });
  }

  $(document).on('click', '.btn-sua-danh-muc', function (e){
    e.preventDefault();
    var idDanhMuc = $(this).attr('data-value');
    loadData('/load-danh-muc', {idDanhMuc: idDanhMuc, token: $("#tokenbody").val()}, blockPage,function(data){
      $("#id-danh-muc").val(data.tid);
      $("#name-danh-muc-thu-chi").val(data.name);

      if($("#field_phan_loai_thu_chi").length > 0)
        $("#field_phan_loai_thu_chi").val(data.field_phan_loai_thu_chi);

      if($("#field_tien_to").length > 0)
        $("#field_tien_to").val(data.field_tien_to);

      if($("#field_chi_phi_hang_thang").length > 0){
        if(data.field_chi_phi_hang_thang == 1)
          $("#field_chi_phi_hang_thang").prop('checked', true);
        else
          $("#field_chi_phi_hang_thang").prop('checked', false);
      }

      if($("#field_hien_thi_tren_hop_dong").length > 0){
        if(data.field_hien_thi_tren_hop_dong == 1)
          $("#field_hien_thi_tren_hop_dong").prop('checked', true);
        else
          $("#field_hien_thi_tren_hop_dong").prop('checked', false);
      }

      $("#field_chi_phi_mac_dinh").val(data.field_chi_phi_mac_dinh);
      $("#edit-danh-muc h3").text('Sửa danh mục');
      $("#edit-danh-muc").modal('show');
      if ($(".numeral-mask").length) {
        $(".numeral-mask").each(function () {
          new Cleave(this, {
            numeral: true,
            numeralThousandsGroupStyle: 'thousand'
          });
        })
      }
    });
  });

  function resetForm(){
    var $phanloai = $("#phan-loai-danh-muc").val();

    $("#edit-submit-quan-ly-danh-muc").click();
    setTimeout(function (){
      if (feather) {
        feather.replace({
          width: 14,
          height: 14
        });
      }
      $("#token-form").val($("#tokenbody").val());
      $("#phan-loai-danh-muc").val($phanloai);
    }, 1000);
  }

  $(document).on('click', '.btn-save-danh-muc-thu-chi', function (e){
    e.preventDefault();
    var data = $("#form-danh-muc-thu-chi").serializeArray();
    $.ajax({
      url: '/save-danh-muc',
      data: data,
      type: 'post',
      dataType:'json',
      beforeSend: function (){
        blockForm($("#form-danh-muc-thu-chi"));
        $("#edit-danh-muc-thu-chi h3").text('Sửa thông tin danh mục');
      },
      success: function (data){
        getToastSuccess(data.content);
        $("#edit-danh-muc").modal('hide');
        resetForm();
      },
      error: function (r1, r2){
        getToastError(r1);
        unblockPage();
      },
      complete: function (){
        unblockPage();
      }
    })
  })

  $(document).on('click','#btn-them-moi-danh-muc', function (e){
    e.preventDefault();
    $("#edit-danh-muc").modal('show');
    $("#id-danh-muc").val('');
    $("#edit-danh-muc h3").text('Thêm danh mục');
    $("#form-danh-muc-thu-chi")[0].reset();
    if ($(".numeral-mask").length) {
      $(".numeral-mask").each(function () {
        new Cleave(this, {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand'
        });
      })
    }
  })

  $(document).on('click', '.btn-xoa-danh-muc', function (e){
    e.preventDefault();
    var $idDanhmuc = $(this).attr('data-value');
    Swal.fire({
      title: 'Thông báo',
      text: "Bạn có chắc chắn muốn xoá dữ liệu này?!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có!',
      cancelButtonText: 'Không!',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-outline-secondary ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        $.ajax({
          url: '/xoa-danh-muc',
          data: {idDanhMuc: $idDanhmuc, token: $("#tokenbody").val()},
          dataType: 'json',
          type: 'post',
          beforeSend: function (){
            blockPage();
          },success: function (data){
            getToastSuccess(data.content);
            resetForm();
          },error: function (r1,r2){
            getToastError(r1);
            unblockPage();
          },complete: function (){
            unblockPage();
          }
        })
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Deleted!',
        //   text: 'Your file has been deleted.',
        //   customClass: {
        //     confirmButton: 'btn btn-success'
        //   }
        // });
      }
    });
  })

  $(document).on('click', '#refresh-table', function (e){
    e.preventDefault();
    resetForm();
  })
})


