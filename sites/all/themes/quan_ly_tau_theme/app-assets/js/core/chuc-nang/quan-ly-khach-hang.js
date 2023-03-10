$(document).ready(function () {
  function resetForm() {
    $("#edit-submit-danh-sach-noi-dung").click();
    setTimeout(function () {
      if (feather) {
        feather.replace({
          width: 14,
          height: 14
        });
      }
      if ($(".flatpickr-basic").length > 0) {
        $('.flatpickr-basic').flatpickr();
      }
      $("#token-form").val($("#tokenbody").val());
    }, 1000);
  }

  function convertYMDtoMDY($str, $splash = '/') {
    var arrStr = $str.split('-');
    return arrStr[1] + $splash + arrStr[2] + $splash + arrStr[0];
  }

  $(document).on('click', '.btn-sua-khach-hang', function (e) {
    e.preventDefault();
    var idDanhMuc = $(this).attr('data-value');
    loadData('/load-khach-hang', {
      idKhachHang: idDanhMuc,
      token: $("#tokenbody").val()
    }, blockPage, function (data) {
      for (var key in data) {
        if ($("#" + key).length > 0) {
          $("#" + key).val(data[key]);
        }
      }
      $("#field_phan_loai_khach_hang").change();
      $("#idModel").val(data.nid);
      $("#title-node").val(data.title_node);
      $("#editKhachHang").modal('show');
    });
    loadDate();
  });

  $(document).on('click', '.btn-xoa-khach-hang', function (e) {
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
          url: '/xoa-khach-hang',
          data: {idKhachHang: $idDanhmuc, token: $("#tokenbody").val()},
          dataType: 'json',
          type: 'post',
          beforeSend: function () {
            blockPage();
          }, success: function (data) {
            getToastSuccess(data.content);
            resetForm();
          }, error: function (r1, r2) {
            getToastError(r1);
            unblockPage();
          }, complete: function () {
            unblockPage();
          }
        })
      }
    });
  })

  $(document).on('click', '.btn-xem-chi-tiet-khach-hang', function (e) {
    e.preventDefault();
    var $idDanhmuc = $(this).attr('data-value');
    $.ajax({
      url: '/chi-tiet-khach-hang',
      data: {idKhachHang: $idDanhmuc, token: $("#tokenbody").val()},
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockPage();
        $(".span-field").html('');
      }, success: function (data) {
        var str = $("#thong-tin-khach-hang").html();
        for (var key in data.khachHang) {
          if (key !== 'nid') {
            $("#xemChiTietKhachHang span#" + key).html(data.khachHang[key]);
          }
        }
        if (data.khachHang.field_phan_loai_khach_hang != 'Khách hàng doanh nghiệp') {
          $(" #xemChiTietKhachHang .block-field-doanh-nghiep").addClass('hidden');
        }
        else {
          $("#xemChiTietKhachHang .block-field-doanh-nghiep").removeClass('hidden');
        }
        $(" #xemChiTietKhachHang #title-node").html(data.khachHang.title_node);
        var $strTr = '';
        var $stt = 1;
        $.each(data.danhSachDichVu, function (k, obj) {
          $strTr += `<tr>
                <td>` + $stt + `</td>
                <td>` + obj.name + `</td>
                <td class="">` + obj.field_dich_vu + `</td>
                <td class="text-right text-danger">` + (parseInt(obj.field_thanh_tien)).toLocaleString('vi', {maximumFractionDigits: 0}) + `</td>
                <td class="text-center">` + obj.field_ngay_hop_dong + `</td>
                <td class="text-center">` + obj.field_ket_thuc_hop_dong + `</td>
                <td class="text-center">` + obj.field_trang_thai + `</td>
                <td class="text-center text-info btn-xem-hop-dong" data-value="` + obj.id + `"><i data-feather='eye'></i></td>
            </tr>`;
          $stt++;
        });
        if (data.danhSachDichVu.length == 0) {
          $strTr = `<tr>
                <td colspan="8">
                  <div class="  alert-warning ">
                      <div class="alert-body">
                      Khách hàng không có dịch vụ nào
                      </div>
                  </div>
                </td>
                </tr>`;
        }
        $("#profile table tbody").html($strTr)
        var $strTrLS = '';
        var $sttLS = 1;
        $.each(data.lichSuThanhToan, function (k, obj) {
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
        if (data.lichSuThanhToan.length == 0) {
          $strTrLS = `<tr>
                <td colspan="8">
                  <div class="  alert-warning ">
                      <div class="alert-body">
                      Khách hàng không có giao dịch nào
                      </div>
                  </div>
                </td>
                </tr>`;
        }
        $("#giao_dich table tbody").html($strTrLS)
        $("#xemChiTietKhachHang").modal('show');
      }, error: function (r1, r2) {
        getToastError(r1);
        unblockPage();
      }, complete: function () {
        if (feather) {
          feather.replace({
            width: 14,
            height: 14
          });
        }
        unblockPage();
      }
    })
  })
  $("h2.brand-text").text('Quản lý khách hàng');
  $(document).on('change', '#field_nguoi_dai_dien_value', function () {
    $('#edit-field-nguoi-dai-dien-value').val($(this).val())
  })
  $(document).on('change', '#field_dien_thoai_value', function () {
    $('#edit-field-dien-thoai-value').val($(this).val())
  })
  $(document).on('change', '#field_ten_doanh_nghiep_cu_value', function () {
    $('#edit-field-ten-doanh-nghiep-cu-value').val($(this).val())
  })
  $(document).on('change', '#title', function () {
    $('#edit-title').val($(this).val())
  })
  $(document).on('change', '#field_email_value', function () {
    $('#edit-field-email-value').val($(this).val())
  })
  $(document).on('change', '#field_dia_chi_value', function () {
    $('#edit-field-dia-chi-value').val($(this).val())
  })
  $(document).on('click', '.btn-tim-kiem-khach-hang', function (e) {
    e.preventDefault();
    $("#views-exposed-form-danh-sach-noi-dung-page-khach-hang #edit-submit-danh-sach-noi-dung").click();
  })
  $(document).on('click', '.btn-khoi-phuc-luoi', function (e) {
    e.preventDefault();
    $("#edit-reset").click();
  });
  $(document).on('change', '#field_ngay_sinh_thanh_lap_value_min_value', function () {
    $("#edit-field-ngay-sinh-thanh-lap-value-min-date").val(convertYMDtoMDY($(this).val()));
    if ($("#edit-field-ngay-sinh-thanh-lap-value-max-date").val() == '') {
      $("#edit-field-ngay-sinh-thanh-lap-value-max-date").val(convertYMDtoMDY($("#field_ngay_sinh_thanh_lap_value_max_value").val()));
    }
  });
  $(document).on('change', '#field_ngay_sinh_thanh_lap_value_max_value', function () {
    $("#edit-field-ngay-sinh-thanh-lap-value-max-date").val(convertYMDtoMDY($(this).val()));
    if ($("#edit-field-ngay-sinh-thanh-lap-value-min-date").val() == '') {
      var d = new Date();

      var month = d.getMonth()+1;
      var day = d.getDate();

      var output = (d.getFullYear()-10) + '-' +
        (month<10 ? '0' : '') + month + '-' +
        (day<10 ? '0' : '') + day;

      $("#edit-field-ngay-sinh-thanh-lap-value-min-date").val(convertYMDtoMDY(output));
    }
  });
})
