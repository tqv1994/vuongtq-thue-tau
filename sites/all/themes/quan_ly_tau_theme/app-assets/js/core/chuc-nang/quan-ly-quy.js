$(document).ready(function () {
  $(".brand-text").html('QUẢN LÝ QUỸ');
  $(document).on('click', '.btn-them-quy', function (e) {
    $(".title-modal-quy").text("Thêm quỹ")
    $("#form-quan-ly-quy #field_tong_tien").attr("readonly",false)
    $("#modal-quan-ly-quy").modal('show');
    $("#form-quan-ly-quy")[0].reset()
    if ($(".numeral-mask").length) {
      $(".numeral-mask").each(function (){
        new Cleave(this, {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand'
        });
      })
    }
  })
  $(document).on('click', '.btn-sua-quy', function (e) {
    loadData('/load-quy',{token: $("#tokenbody").val(),id:$(this).attr("data-value")},function (){
      blockPage()
    },function (data){
      $(".title-modal-quy").text("Cập nhật thông tin quỹ")
      $("#modal-quan-ly-quy").modal('show');
      $("#form-quan-ly-quy")[0].reset()
      $.each(data,function (key,value){
        $("#form-quan-ly-quy #"+key).val(value)
      })
      $("#form-quan-ly-quy #field_tong_tien").attr("readonly",true)
      if(data.field_loai_quy =="Ngân hàng"){
        $(".block-tai-khoan-ngan-hang").removeClass("hidden")
        $(".block-tien-mat").removeClass("col-6")
        $(".block-tien-mat").addClass("col-4")
      }
      if ($(".numeral-mask").length) {
        $(".numeral-mask").each(function (){
          new Cleave(this, {
            numeral: true,
            numeralThousandsGroupStyle: 'thousand'
          });
        })
      }
    })
    if ($(".numeral-mask").length) {
      $(".numeral-mask").each(function (){
        new Cleave(this, {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand'
        });
      })
    }
  })
  $(document).on('click', '.btn-xem-chi-tiet-quy', function (e) {
    loadData('/xem-chi-tiet-quy',{token: $("#tokenbody").val(),id:$(this).attr("data-value")},function (){
      blockPage()
    },function (data) {
      $("#modal-quy").modal('show');
      $.each(data,function (key,value){
        $("#modal-quy #"+key).text(value)
      })
      if(data.field_loai_quy=="Tiền mặt"){
        $(".block-ngan-hang").addClass("hidden")
      }
      else {
        $(".block-ngan-hang").removeClass("hidden")
      }
      var $strTrLS = '';
      var $sttLS = 1;
      $.each(data.listThuChi, function (k, obj) {
        var so_tien ='';
        if(obj.field_phan_loai=="Thu"){
          so_tien = '<b>+ '+(parseInt(obj.field_so_tien)).toLocaleString('vi', {maximumFractionDigits: 0})+'</b>'
        }
        else {
          so_tien = '<b>- '+(parseInt(obj.field_so_tien)).toLocaleString('vi', {maximumFractionDigits: 0})+'</b>'
        }
        $strTrLS += `<tr>
                <td>` + $sttLS + `</td>
                <td class="text-center">` + obj.field_ngay_nhap + `</td>
                <td class="">` + obj.userNhap + `</td>
                <td class="text-right text-danger">` + so_tien + `</td>
                <td class="">` + obj.field_hinh_thuc_thanh_toan + `</td>
                <td class="">` + obj.field_ly_do + `</td>
                <td class="text-center">` + obj.field_ghi_chu + `</td>
            </tr>`;
        $sttLS++;
      });
      if (data.listThuChi.length == 0) {
        $strTrLS = `<tr>
                <td colspan="8">
                  <div class="  alert-warning ">
                      <div class="alert-body">
                     Không có giao dịch

                      </div>
                  </div>
                </td>
                </tr>`;
      }
      $("#thu_chi table tbody").html($strTrLS)
    })
  })
  $(document).on('click', '.btn-save-quy', function (e) {
    loadData('/save-quy',$('#form-quan-ly-quy').serializeArray(),function (){
      blockForm($('#form-quan-ly-quy'))
    },function (data){
      getToastSuccess(data.content)
      $("#edit-reset").click();
    })
  })
  $(document).on('click', '.btn-xoa-quy', function (e) {
    e.preventDefault();
    var $id = $(this).attr('data-value');
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
          url: '/xoa-quy',
          data: {id: $id, token: $("#tokenbody").val()},
          dataType: 'json',
          type: 'post',
          beforeSend: function () {
            blockPage();
          }, success: function (data) {
            getToastSuccess(data.content);
            $("#edit-reset").click();
          }, error: function (r1, r2) {
            getToastError(r1);
            unblockPage();
          }, complete: function () {
            unblockPage();
          }
        })
      }
    });
  });
  $(document).on('click', '.btn-khoi-phuc-luoi', function (e) {
    e.preventDefault();
    $("#edit-reset").click();
  });
  $(document).on('click', '.btn-tim-kiem-quy', function (e) {
    e.preventDefault();
    $("#views-exposed-form-danh-sach-noi-dung-quan-ly-quy #edit-submit-danh-sach-noi-dung").click();
  })
  $(document).on("change","#field_loai_quy",function (){
    if($(this).val()=="Ngân hàng"){
      $(".block-tai-khoan-ngan-hang").removeClass("hidden")
      $(".block-tien-mat").removeClass("col-6")
      $(".block-tien-mat").addClass("col-4")
    }
    else {
      $(".block-tai-khoan-ngan-hang").addClass("hidden")
      $(".block-tai-khoan-ngan-hang input,textarea").val("")
      $(".block-tien-mat").removeClass("col-4")
      $(".block-tien-mat").addClass("col-6")
    }
  })
  $(document).on('change', '#title', function () {
    $('#edit-title').val($(this).val())
  })
  $(document).on('change', '#field_loai_quy_search', function () {
    $('#edit-field-loai-quy-value').val($(this).val())
  })
})
