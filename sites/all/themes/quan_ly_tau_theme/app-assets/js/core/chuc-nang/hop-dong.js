$(document).ready(function () {
  $(".brand-text").html('QUẢN LÝ DỮ LIỆU HỢP ĐỒNG')

  function tinhTongTienHopDong() {
    var $tongTienDichVu = 0;
    $(".row-dich-vu").each(function () {
      var $donGia = parseInt($(this).find('.td-don-gia input').val() == '' ? 0 : $(this).find('.td-don-gia input').val().replaceAll(',', '')),
        $vat = parseInt($(this).find('.td-vat input').val() == '' ? 0 : $(this).find('.td-vat input').val().replaceAll(',', ''));
      var $thanhTien = ($donGia * (1 + $vat / 100));
      $(this).find('.td-thanh-tien').text($thanhTien.toLocaleString('vi', {maximumFractionDigits: 0}));
      $tongTienDichVu += $thanhTien;
    });
    $("#thanh-tien-dich-vu").text($tongTienDichVu.toLocaleString('vi', {maximumFractionDigits: 0}));
  }

  function tinhTongTienKhiSuaHopDong() {
    // Khi sửa hợp đồng
    if ($("#id-model").length > 0) {
      if ($("#id-model").val() != '') {
        var $donGia = (parseInt($("#field_don_gia_dich_vu").val() == '' ? 0 : ($("#field_don_gia_dich_vu").val().replaceAll(',', '')))),
          $vat = (parseInt($("#field_vat").val() == '' ? 0 : $("#field_vat").val().replaceAll(',', '')));

        var $thanhTien = $donGia * (1 + $vat / 100);
        $("#thanh-tien-dich-vu").text($thanhTien.toLocaleString('vi', {maximumFractionDigits: 0}));
      }
    }
  }

  function tinhTongTienChiPhiKhacKhiSuaHopDong() {
    var $tong = 0;
    $(".row-chi-phi-khac").each(function () {
      var $donGia = $(this).find('.td-don-gia-chi-phi-khac input').val(),
        $soLuong = $(this).find('.td-so-luong-chi-phi-khac input').val(),
        $tongTien = 0;
      $donGia = ($donGia == '' ? 0 : parseInt($donGia.replaceAll(',', '')));
      $soLuong = ($soLuong == '' ? 0 : parseInt($soLuong.replaceAll(',', '')));
      console.log($donGia, $soLuong);
      $tongTien = $donGia * $soLuong;
      $(this).find('.td-tong-tien-chi-phi-khac').text($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}));
      $tong += $tongTien;
    });
    $("#tong-tien-chi-phi-khac").text($tong.toLocaleString('vi', {maximumFractionDigits: 0}));
  }

  function resetForm() {
    $("#views-exposed-form-danh-sach-noi-dung-page-hop-dong #edit-submit-danh-sach-noi-dung").click();
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
      $(".token-form").val($("#tokenbody").val());
    }, 1000);
  }

  function formatRepo(repo) {
    if (repo.loading) {
      return repo.text;
    }
    var markup =
      "<div class='select2-result-repository clearfix'><div class='select2-result-repository__title'>" + repo.name + '</div></div>';
    return markup;
  }

  function formatRepoSelection(repo) {
    console.log(repo);
    return repo.name || repo.text;
  }

  $(document).on('click', '.btn-remove-hop-dong', function (e) {
    e.preventDefault();
    const value = $(this).attr("data-value");
    $("input[value=" + value + "]").prop('checked', false);
    $("input[value=" + value + "]").change()
    $(this).parent().parent().remove();
  });
  $(document).on('change', '.item-hop-dong', function () {
    var $selected = false;
    if ($(this).is(':checked')) {
      $selected = true;
    }
    if ($selected) {
      $(this).prop('checked', true);
      if ($('.block-item-hop-dong li#hop-dong-' + $(this).val()).length === 0) {
        $(".block-item-hop-dong").append(`<li id="hop-dong-` + $(this).val() + `" class="margin-bottom-10">
                        <button class="btn btn-primary mr-10 position-relative">
                            <a href="#" class="text-danger btn-remove-hop-dong" data-value="` + $(this).val() + `"><i data-feather='trash-2'></i></a>` + $(this).val() + `
                        </button>
                          <input type="hidden" value="` + $(this).attr("data-value") + `" name="HopDong[` + $(this).attr("data-value") + `]">
                    </li>`)
      }
    }
    else {
      $(".block-item-hop-dong li#hop-dong-" + $(this).val()).remove();
    }
    if (feather) {
      feather.replace({
        width: 14,
        height: 14
      });
    }
    if ($(".flatpickr-basic").length > 0) {
      $('.flatpickr-basic').flatpickr();
    }
  })

  $(document).on('click', '.btn-thanh-toan-them', function (e) {
    e.preventDefault();
    if ($(".block-item-hop-dong li").length == 0) {
      toastError("Vui lòng chọn hợp đồng cần thanh toán")
    }
    else {
      loadData("/load-danh-sach-hop-dong", $("#form-thanh-toan-them").serializeArray(), function () {
        blockPage()
      }, function (data) {
        var $trNewRow;
        $.each(data.hopDong, function (key, value) {
          $trNewRow +=
            `<tr class="td-`+value.nid+`">
            <td class="">
                <div class="mt-1">
                    <input class="hidden" name="nodeID[]" value="`+value.nid+`">
                    <p>Khách hàng:<span class="field_khach_hang_hd"> `+value.field_khach_hang_hd+`</span></p>
                    <p>Mã HĐ:<span class="field_ma_hop_dong_hd text-primary"> `+value.field_ma_hop_dong_hd+`</span></p>
                    <p>Còn lại: <span class="field_tong_tien_con_lai text-danger font-20"> `+value.field_tong_tien_con_lai+`</span>/<span class="field_tong_tien_hop_dong text-blue">`+value.field_tong_tien_hop_dong+`</span></p>
                </div>
            </td>
            <td class="">
               <div class="form-group mt-1" >
                  <select class="form-select field_ly_do"  name="field_ly_do[]">
                  </select>
              </div>
              <div class="form-group "  >
                  <select class="form-select field_quy"  name="field_quy[]">
                  </select>
              </div>
            </td>
            <td>
                <input class="form-control mt-1 numeral-mask text-right" value="`+value.field_tong_tien_con_lai+`" name="field_so_tien[]" placeholder="Số tiền cần thanh toán" >
                <div class="form-group mt-1">
                      <select class="form-select" name="field_hinh_thuc_thanh_toan[]">
                          <option value="">-- Chọn CK / TM --</option>
                          <option value="Chuyển khoản">Chuyển khoản</option>
                          <option value="Tiền mặt">Tiền mặt</option>
                      </select>
                </div>
            </td>
            <td class="">
                <textarea class="form-control" rows="3" name="field_thong_tin_thanh_toan[]" placeholder="Thông tin thanh toán"></textarea>
             </td>
            <td class="text-center">
              <a href="#" class="text-danger btn-xoa-dong-hop-dong">
                <i data-feather='trash-2'></i>
              </a>
            </td>

        </tr>`;

        })
        $("#table-thanh-toan-them-nhieu-hop-dong tbody").html($trNewRow);
        var $strLD = "<option value=''>-- Chọn lý do --</option>";
        $.each(data.lyDo, function (keyLyDo, valueLyDo) {
          $strLD += '<option value="' + valueLyDo.tid + '">' + valueLyDo.name + '</option>'
        })
        $('.field_ly_do').html($strLD);
        var $strQuy = "<option value=''>-- Chọn quỹ --</option>";
        $.each(data.listQuy, function (keyQuy, valueQuy) {
          $strQuy += '<option value="' + valueQuy.nid + '">' + valueQuy.name + '</option>'
        })
        $('.field_quy').html($strQuy);
        $("#modal-thanh-toan-them-nhieu-hop-dong").modal("show")
        if (feather) {
          feather.replace({
            width: 14,
            height: 14
          });
        }
        if ($(".numeral-mask").length) {
          $(".numeral-mask").each(function () {
            new Cleave(this, {
              numeral: true,
              numeralThousandsGroupStyle: 'thousand'
            });
          })
        }
      })
    }
  })
  $(document).on('click', '.btn-save-thanh-toan', function (e) {
    loadData("/luu-thanh-toan-them",$("#form-thanh-toan-them-nhieu-hop-dong").serializeArray(),function (){
      blockForm($("#form-thanh-toan-them-nhieu-hop-dong"))
    },function (data){
      getToastSuccess(data.content)
      window.location = "tat-ca-hop-dong"
    })
  })
  $(document).on('click', '.btn-xoa-dong-hop-dong', function (e) {
    var $row =  $(this).parent().parent();
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
       $row.remove()
      }
    });
  })
  $(document).on('click', '.btn-them-dong', function (e) {
    e.preventDefault();
    if ($("#table-dich-vu .empty-row").length > 0) {
      $("#table-dich-vu .empty-row").remove();
    }

    $.ajax({
      url: '/get-terms',
      data: {
        type: 'phan_loai_hop_dong',
        token: $("#tokenbody").val()
      },
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockPage();
      },
      success: function (data) {
        var $strOptions = '';
        $.each(data, function (key, obj) {
          $strOptions += '<option value="' + obj.tid + '-' + obj.don_gia + '">' + obj.name + '</option>';
        })

        $("#table-dich-vu tbody").append(
          `<tr class="new-row row-dich-vu">
            <td>
              <select class="select2 form-select selection-dich-vu" name="newDichVu[]">
                <option value="">-- Chọn dịch vụ --</option>
                ` + $strOptions + `
              </select>
            </td>
            <td>
              <input type="text" name="new_field_ngay_start_dich_vu[]" value="" class="form-control flatpickr-basic" placeholder="YYYY-MM-DD" />
            </td>
            <td>
              <input type="text" name="new_field_ngay_end_dich_vu[]" value="" class="form-control flatpickr-basic" placeholder="YYYY-MM-DD" />
            </td>
            <td class="td-don-gia">
              <input type="text" name="new_field_so_tien[]" class="form-control numeral-mask text-right" placeholder="Đơn giá" value="0" data-msg="Đơn giá" />
            </td>
            <td class="td-hang-muc">
              <input type="text" name="field_hang_muc_hop_dong[]" class="form-control" placeholder="Hạng mục" data-msg="Hạng mục" />
            </td>
            <td class="td-vat">
              <input type="text" name="new_vat[]" class="form-control numeral-mask  text-right" placeholder="VAT (%)" value="0" data-msg="VAT (%)" />
            </td>
            <td class="td-thanh-tien text-danger text-right">

            </td>
            <td class="text-center" rowspan="2">
              <a href="#" class="text-danger btn-xoa-dich-vu">
                <i data-feather='trash-2'></i>
              </a>
            </td>
        </tr>
        <tr class="new-row-ghi-chu">
            <td class="td-ghi-chu" colspan="7">
                <textarea class="form-control" rows="2" name="new_ghi_chu[]" placeholder="Ghi chú"></textarea>
            </td>
        </tr>`
        );
      },
      complete: function () {
        // if ($(".select2").length > 0) {
        //   $(".select2").each(function () {
        //     var $this = $(this);
        //     // $this.wrap('<div class="position-relative"></div>');
        //     $this.select2({
        //       dropdownAutoWidth: true,
        //       dropdownParent: $this.parent(),
        //       width: '100%',
        //       ajax: {
        //         url: '/get-list-khach-hang',
        //         dataType: 'json',
        //         delay: 250,
        //         type: 'post',
        //         data: function (params) {
        //           return {
        //             q: params.term,
        //             token: $("#tokenbody").val(),// search term
        //             page: params.page
        //           };
        //         },
        //         processResults: function (data, params) {
        //           // parse the results into the format expected by Select2
        //           // since we are using custom formatting functions we do
        // not
        //           // need to alter the remote JSON data, except to indicate
        // that // infinite scrolling can be used params.page = params.page ||
        // 1;  return { results: data.items, pagination: { more: params.page *
        // 30 < data.total_count } }; }, cache: true }, placeholder: 'Nhập tên
        // khách hàng', escapeMarkup: function (markup) { return markup; }, //
        // let our custom formatter work minimumInputLength: 2, templateResult:
        // formatRepo, templateSelection: formatRepoSelection }); }); }

        if ($(".flatpickr-basic").length > 0) {
          $('.flatpickr-basic').flatpickr();
        }

        if (feather) {
          feather.replace({
            width: 14,
            height: 14
          });
        }

        //Numeral
        if ($(".numeral-mask").length) {
          $(".numeral-mask").each(function () {
            new Cleave(this, {
              numeral: true,
              numeralThousandsGroupStyle: 'thousand'
            });
          })
        }

        unblockPage();

      },
      error: function (r1, r2) {
        getToastError(r1);
      }
    })
  });

  $(document).on('change', '.selection-dich-vu', function (e) {
    e.preventDefault();
    var arrTidGia = $(this).val().split('-');
    $(this).parent().parent().find('.td-don-gia input').val(arrTidGia[1]);
    //Numeral
    if ($(".numeral-mask").length) {
      $(".numeral-mask").each(function () {
        new Cleave(this, {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand'
        });
      })
    }
    tinhTongTienHopDong();
  });

  $(document).on('change', '.td-don-gia-chi-phi-khac input, .td-so-luong-chi-phi-khac input', function (e) {
    tinhTongTienChiPhiKhacKhiSuaHopDong();
  });
  //
  // $(document).on('change', '#field_khach_hang_ref', function (e){
  //   $.ajax({
  //     url: '/chi-tiet-khach-hang',
  //     data: {idKhachHang: $(this).val(), token: $("#tokenbody").val()},
  //     dataType: 'json',
  //     type: 'post',
  //     beforeSend: function (){
  //       blockPage();
  //     },
  //     success: function (data){
  //       $("#mst-khach-hang").text(data.khachHang.field_ma_so_thue);
  //       $("#sdt-khach-hang").text(data.khachHang.field_dien_thoai);
  //       $("#email-khach-hang").text(data.khachHang.field_email);
  //       $("#ten-khach-hang").text(data.khachHang.title_node);
  //       $("#ma-khach-hang").text(data.khachHang.field_ma_khach_hang);
  //     },
  //     complete: function (){
  //       unblockPage();
  //     },
  //     error: function (r1, r2){
  //       getToastError(r1);
  //     }
  //   })
  // });

  $(document).on('change', '.td-don-gia input, .td-field_so_tien input, .td-field_so_luong input, .td-so-luong input, .td-vat input', function () {
    tinhTongTienHopDong();
  });

  $(document).on('click', '.btn-save-hop-dong', function (e) {
    e.preventDefault();

    $.ajax({
      url: '/save-hop-dong',
      data: $("#edit-form-hop-dong").serializeArray(),
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockPage();
      },
      success: function (data) {
        getToastSuccess(data.content);
        setTimeout(function () {
          window.location = 'tat-ca-hop-dong';
        }, 3000);
      },
      complete: function () {
        unblockPage();
      },
      error: function (r1, r2) {
        getToastError(r1);
      }
    })
  });

  $(document).on('click', '.btn-xoa-dich-vu', function (e) {
    e.preventDefault();
    var $idModel = $(this).attr('data-value'),
      $myRow = $(this).parent().parent();
    var $nextRowGhiChu = $myRow.next();
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
        var $listDVDaXoa = $("#dich-vu-da-xoa").val();
        $("#dich-vu-da-xoa").val(
          $listDVDaXoa + ' ' + $idModel
        );
        $myRow.remove();
        $nextRowGhiChu.remove();
        tinhTongTienHopDong();
      }
    });
  })

  tinhTongTienKhiSuaHopDong();
  tinhTongTienChiPhiKhacKhiSuaHopDong();

  $(document).on('click', '.thanh-toan-hop-dong, .thanh-toan-chi-phi-phat-sinh', function (e) {
    e.preventDefault();
    $("#form-thanh-toan-hop-dong #token-form-hop-dong").val($("#tokenbody").val());
    var $nidHopDong = $(this).attr('data-value');
    $("#field_hop_dong_cu").val($nidHopDong);
    var $type = 'thanh_toan', $titleModel = 'Thanh toán hợp đồng ';
    if (!$(this).hasClass('thanh-toan-hop-dong')) {
      $type = 'chi_phi';
      $titleModel = 'Thanh toán chi phí hợp đồng ';
      $("#col-thong-tin-thanh-toan, #block-phieu-thu").addClass('hidden');
    }
    else {
      $("#col-thong-tin-thanh-toan, #block-phieu-thu").removeClass('hidden');
    }

    $.ajax({
      url: '/load-thong-tin-thanh-toan-hop-dong',
      data: {
        token: $("#tokenbody").val(),
        nidHopDong: $nidHopDong,
        type: $type
      },
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        $("#lich-su-thanh-toan table tbody, #danh-sach-chi-phi table tbody").html('');
        blockPage();
      },
      success: function (data) {
        $("#form-thanh-toan-hop-dong")[0].reset()
        $("#title-modal-thanh-toan").text($titleModel);
        $("#ten-khach-hang").text(data.khachHang.hoTen);
        $("#ma-khach-hang").text(data.khachHang.maKhach);
        $("#mst-khach-hang").text(data.khachHang.ma_so_thue);
        $("#sdt-khach-hang").text(data.khachHang.dien_thoai);
        $("#email-khach-hang").text(data.khachHang.email);
        $('#field_ly_do').html('<option value="">-- Chọn --</option>');
        $.each(data.ly_do, function (key, value) {
          $('#field_ly_do').append('<option value="' + value.tid + '">' + value.name + '</option>');
        })

        $("#ma-hop-dong").text(data.hopDong.ma_hop_dong);
        var $strTr = '', $stt = 1, $tongTien = 0;

        if ($type != 'chi_phi') {
          $("#field_quy_lien_ket").empty()
          $("#field_quy_lien_ket").append(`<option value="">-- Chọn --</option>`)
          $.each(data.listQuy, function (key, value) {
            $("#field_quy_lien_ket").append(`<option value="` + value.nid + `">` + value.name + `</option>`)
          })
          $("#type_form").val('Thu');
          $("#danh-sach-chi-phi").addClass("hidden")
          $("#tong-tien-hop-dong").text((parseInt(data.hopDong.tongTienHD)).toLocaleString('vi', {maximumFractionDigits: 0}));
          $("#chi-phi-vat").text((parseInt(data.hopDong.chi_phi_vat)).toLocaleString('vi', {maximumFractionDigits: 0}));
          $("#ti-le-vat").text(data.hopDong.vat);
          $("#thanh-tien-sau-vat").text((parseInt(data.hopDong.tt_sau_vat)).toLocaleString('vi', {maximumFractionDigits: 0}));
          $("#da-thanh-toan").text((parseInt(data.hopDong.da_thanh_toan)).toLocaleString('vi', {maximumFractionDigits: 0}));
          $("#so-tien-con-lai-chua-thanh-toan").text((parseInt(data.hopDong.so_tien_con_lai)).toLocaleString('vi', {maximumFractionDigits: 0}));

          $("#block-thu-chi-phi-hop-dong, #col-thong-tin-chi-phi").addClass('hidden');
          $("#col-thong-tin-thanh-toan").removeClass('hidden');
        }
        else {
          $("#field_quy_lien_ket_chi").empty()
          $("#field_quy_lien_ket_chi").append(`<option value="">-- Chọn --</option>`)
          $.each(data.listQuy, function (key, value) {
            $("#field_quy_lien_ket_chi").append(`<option value="` + value.nid + `">` + value.name + `</option>`)
          })
          $("#block-thu-chi-phi-hop-dong, #col-thong-tin-chi-phi").removeClass('hidden');
          $("#col-thong-tin-thanh-toan").addClass('hidden');
          $("#danh-sach-chi-phi").removeClass("hidden")
          $("#type_form").val('Chi');
          $.each(data.chiPhiKhac, function (k, obj) {
            $strTr += `<tr>
                <td>` + $stt + `</td>
                <td>` + obj.name + `</td>
                <td class="text-right">` + (parseInt(obj.field_so_tien)).toLocaleString('vi', {maximumFractionDigits: 0}) + `</td>
                <td class="text-right">` + obj.field_so_luong + `</td>
                <td class="text-right">` + (parseInt(obj.field_tong_tien)).toLocaleString('vi', {maximumFractionDigits: 0}) + `</td>
            </tr>`;
            $tongTien += parseInt(obj.field_tong_tien);
            $stt++;
          });
          $("#tong-tien-chi-hop-dong, #tong-tien-chi-phi-khac").text($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}));
          $("#tong-tien-da-chi-hop-dong").text((parseInt(data.tongTienDaChi)).toLocaleString('vi', {maximumFractionDigits: 0}));
          $("#tong-tien-can-chi-hop-dong").text(($tongTien - parseInt(data.tongTienDaChi)).toLocaleString('vi', {maximumFractionDigits: 0}));
          $("#danh-sach-chi-phi table tbody").html($strTr);
        }

        // Hiển thị danh sách lịch sử thanh toán
        $strTr = '';
        $stt = 1;
        $tongTien = 0;
        if (data.lichSuThanhToan.length > 0) {
          $.each(data.lichSuThanhToan, function (k, obj) {
            $strTr += `<tr>
                            <td>` + $stt + `</td>
                            <td class="text-center">` + obj.field_ngay_nhap + `</td>
                            <td>` + obj.userNhap + `</td>
                            <td class="text-right">` + (parseInt(obj.field_so_tien).toLocaleString('vi', {maximumFractionDigits: 0})) + `</td>
                            <td>` + obj.field_hinh_thuc_thanh_toan + `<br/>` + obj.field_thong_tin_thanh_toan + `</td>
                            <td>` + obj.field_ly_do + `</td>
                            <td></td>
                        </tr>`;
            $tongTien += parseInt(obj.field_so_tien)
            $stt++;
          });
          $("#lich-su-thanh-toan table tbody").html($strTr);
          $("#tong-tien-da-thu").html($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}))
        }

        $strTr = '';
        $stt = 1;
        $tongTien = 0;
        // Hiển thị danh sách chi phí khác
        if (data.chiPhiKhac.length > 0) {
          $.each(data.chiPhiKhac, function (k, obj) {
            $strTr += `<tr>
                            <td>` + $stt + `</td>
                            <td>` + obj.name + `</td>
                            <td class="text-right">` + (parseInt(obj.field_so_luong).toLocaleString('vi', {maximumFractionDigits: 0})) + `</td>
                            <td class="text-right">` + (parseInt(obj.field_so_tien).toLocaleString('vi', {maximumFractionDigits: 0})) + `</td>
                            <td class="text-right">` + (parseInt(obj.field_tong_tien).toLocaleString('vi', {maximumFractionDigits: 0})) + `</td>
                        </tr>`;
            $tongTien += parseInt(obj.field_tong_tien)
            $stt++;
          });
          $("#danh-sach-chi-phi table tbody").html($strTr);
          $("#danh-sach-chi-phi table tfoot .tong-tien-chi-phi-khac").html($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}))
        }

        $("#modal-thanh-toan-hop-dong").modal('show');
      },
      complete: function () {
        unblockPage();
      },
      error: function (r1, r2) {
        getToastError(r1);
      }
    })
  });

  $(document).on('click', '.btn-luu-thanh-toan-hop-dong', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/luu-thong-tin-thanh-toan-hop-dong',
      data: $("#form-thanh-toan-hop-dong").serializeArray(),
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockForm($("#form-thanh-toan-hop-dong"));
      },
      success: function (data) {
        getToastSuccess(data.content);
        $("#modal-thanh-toan-hop-dong").modal('hide');
        resetForm();
      },
      complete: function () {
        unblockPage();
      },
      error: function (r1, r2) {
        getToastError(r1);
        unblockPage();
      }
    })
  });

  $(document).on('click', '.xoa-hop-dong', function (e) {
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
          url: '/xoa-hop-dong',
          data: {idHopDOng: $idDanhmuc, token: $("#tokenbody").val()},
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
  });

  $(document).on('click', '.xem-chi-tiet-hop-dong', function (e) {
    e.preventDefault();
    var $idDanhmuc = $(this).attr('data-value');
    $.ajax(
      {
        url: '/xem-chi-tiet-hop-dong',
        data: {hopDong: $idDanhmuc, token: $("#tokenbody").val()},
        dataType: 'json',
        type: 'post',
        beforeSend: function () {
          blockPage();
          $("#tab-lich-su-thanh-toan table tbody, #tab-chi-phi table tbody, #tab-trang-thai-hop-dong table tbody, #tab-lich-su-chi table tbody").html('');
        },
        success: function (data) {
          for (const key in data.hopDong) {
            $("." + key).text(data.hopDong[key]);
          }
          for (const key in data.khachHang) {
            $("." + key).text(data.khachHang[key]);
          }

          var $strTr = '', $stt = 1, $tongTien = 0;
          // Hiển thị danh sách lịch sử thanh toán
          if (data.lichSuThanhToan.length > 0) {
            $.each(data.lichSuThanhToan, function (k, obj) {
              $strTr += `<tr>
                            <td>` + $stt + `</td>
                            <td class="text-center">` + obj.field_ngay_nhap + `</td>
                            <td>` + obj.userNhap + `</td>
                            <td class="text-right">` + (parseInt(obj.field_so_tien).toLocaleString('vi', {maximumFractionDigits: 0})) + `</td>
                            <td>` + obj.field_hinh_thuc_thanh_toan + `<br/>` + obj.field_thong_tin_thanh_toan + `</td>
                            <td>` + obj.field_ly_do + `</td>
                            <td></td>
                        </tr>`;
              $tongTien += parseInt(obj.field_so_tien)
              $stt++;
            });
            $("#tab-lich-su-thanh-toan table tbody").html($strTr);
            $("#tong-tien-da-thu-view").html($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}))
          }

          $strTr = '';
          $stt = 1;
          $tongTien = 0;
          // Hiển thị danh sách chi phí khác
          if (data.listChiPhiKhac.length > 0) {
            $.each(data.listChiPhiKhac, function (k, obj) {
              $strTr += `<tr>
                            <td>` + $stt + `</td>
                            <td>` + obj.name + `</td>
                            <td class="text-right">` + (parseInt(obj.field_so_luong).toLocaleString('vi', {maximumFractionDigits: 0})) + `</td>
                            <td class="text-right">` + (parseInt(obj.field_so_tien).toLocaleString('vi', {maximumFractionDigits: 0})) + `</td>
                            <td class="text-right">` + (parseInt(obj.field_tong_tien).toLocaleString('vi', {maximumFractionDigits: 0})) + `</td>
                        </tr>`;
              $tongTien += parseInt(obj.field_tong_tien)
              $stt++;
            });
            $("#tab-chi-phi table tbody").html($strTr);
            $("#tab-chi-phi table tfoot .tong-tien-chi-phi-khac").html($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}))
          }

          // Hiển thị lịch sử chi
          $strTr = '';
          $stt = 1;
          $tongTien = 0;
          if (data.lichSuChi.length > 0) {
            $.each(data.lichSuChi, function (k, obj) {
              $strTr += `<tr>
                            <td>` + $stt + `</td>
                            <td class="text-center">` + obj.field_ngay_nhap + `</td>
                            <td>` + obj.userNhap + `</td>
                            <td class="text-right">` + (parseInt(obj.field_so_tien).toLocaleString('vi', {maximumFractionDigits: 0})) + `</td>
                            <td>` + obj.field_hinh_thuc_thanh_toan + `<br/>` + obj.field_thong_tin_thanh_toan + `</td>
                        </tr>`;
              $tongTien += parseInt(obj.field_so_tien)
              $stt++;
            });
            $("#tab-lich-su-chi table tbody").html($strTr);
            $("#tong-tien-da-chi").html($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}))
          }

          // Hiển thị trạng thái hợp đồng
          $strTr = '';
          $stt = 1;
          $tongTien = 0;
          if (data.listTrangThaiHopDong.length > 0) {
            $.each(data.listTrangThaiHopDong, function (k, obj) {
              $strTr += `<tr>
                            <td>` + $stt + `</td>
                            <td class="text-center">` + obj.created + `</td>
                            <td>` + obj.user + `</td>
                            <td>` + obj.field_trang_thai + `</td>
                        </tr>`;
              $stt++;
            });
            $("#tab-trang-thai-hop-dong table tbody").html($strTr);
          }

          $("#modal-xem-hop-dong").modal('show');
        },
        complete: function () {
          unblockPage();
        },
        error: function (r1, r2) {
          getToastError(r1);
          unblockPage();
        }
      }
    )
  });

  //Numeral
  if ($(".numeral-mask").length) {
    $(".numeral-mask").each(function () {
      new Cleave(this, {
        numeral: true,
        numeralThousandsGroupStyle: 'thousand'
      });
    })
  }

  $(document).on('change', '#field_dich_vu, #field_vat, #field_so_luong_dich_vu, #field_don_gia_dich_vu', function () {
    if ($(this).attr('id') == 'field_dich_vu') {
      var $donGia = $(this).val().split('-')[1];
      $("#field_don_gia_dich_vu").val(
        (parseInt($donGia)).toLocaleString('vi', {maximumFractionDigits: 0}).replaceAll('.', ',')
      );
    }
    tinhTongTienKhiSuaHopDong();
  });

  $(document).on('click', '.btn-them-dong-chi-phi-khac', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/get-terms',
      data: {
        type: 'loai_thu_chi',
        token: $("#tokenbody").val()
      },
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockPage();
      },
      success: function (data) {
        var $strOptions = '';
        $.each(data, function (key, obj) {
          $strOptions += '<option value="' + obj.tid + '-' + obj.don_gia + '">' + obj.name + '</option>';
        });

        $("#table-chi-phi-khac tbody").append(
          `<tr class="new-row row-chi-phi-khac">
            <td>
              <select class="select2 form-select selection-chi-phi" name="field_loai_chi_phi[]">
                <option value="">-- Chọn chi phí khác --</option>
                ` + $strOptions + `
                  <option value="them-chi-phi-khac">[ + ] Thêm chi phí khác</option>
              </select>
              <div class="inner-input-them-chi-phi hidden mt-1">
                <input type="text" name="chiPhiKhac[]" value="" class="form-control" placeholder="Nhập tên chi phí khác">
              </div>
            </td>
            <td class="td-don-gia-chi-phi-khac">
              <input type="text" name="field_so_tien[]" class="form-control numeral-mask text-right" placeholder="Đơn giá" value="0" data-msg="Đơn giá" />
            </td>
            <td class="td-so-luong-chi-phi-khac">
              <input type="text" name="field_so_luong[]" class="form-control numeral-mask  text-right" placeholder="Số lượng" value="1" data-msg="Số lượng" />
            </td>
            <td class="td-tong-tien-chi-phi-khac text-right">
            </td>
            <td class="text-center">
              <a href="#" class="text-danger btn-xoa-chi-phi-khac">
                <i data-feather='trash-2'></i>
              </a>
            </td>
        </tr>`
        );
      },
      complete: function () {
        if ($(".select2").length > 0) {
          $(".select2").each(function () {
            var $this = $(this);
            // $this.wrap('<div class="position-relative"></div>');
            $this.select2({
              // the following code is used to disable x-scrollbar when click
              // in select input and take 100% width in responsive also
              dropdownAutoWidth: true,
              width: '100%',
              dropdownParent: $this.parent()
            });
          });
        }
        //Numeral
        if ($(".numeral-mask").length) {
          $(".numeral-mask").each(function () {
            new Cleave(this, {
              numeral: true,
              numeralThousandsGroupStyle: 'thousand'
            });
          })
        }
        if (feather) {
          feather.replace({
            width: 14,
            height: 14
          });
        }
        unblockPage();

      },
      error: function (r1, r2) {
        getToastError(r1);
      }
    })
  });

  $(document).on('change', '.selection-chi-phi ', function () {
    $(this).parent().find('.inner-input-them-chi-phi input').val('');
    $(this).parent().parent().find('.td-don-gia-chi-phi-khac input').val(0);

    if ($(this).val() == '') {
      if (!$(this).parent().find('.inner-input-them-chi-phi').hasClass('hidden')) {
        $(this).parent().find('.inner-input-them-chi-phi').addClass('hidden');
      }
    }
    else if ($(this).val() == 'them-chi-phi-khac') {
      $(this).parent().find('.inner-input-them-chi-phi').removeClass('hidden');
    }
    else {
      if (!$(this).parent().find('.inner-input-them-chi-phi').hasClass('hidden')) {
        $(this).parent().find('.inner-input-them-chi-phi').addClass('hidden');
      }
      var $donGia = $(this).val().split('-')[1];
      $(this).parent().parent().find('.td-don-gia-chi-phi-khac input').val(parseInt($donGia).toLocaleString('vi', {
        maximumFractionDigits: 0,
        style: 'decimal'
      }).replaceAll('.', ','));
    }
    tinhTongTienChiPhiKhacKhiSuaHopDong();
  })

  $(document).on('click', '.btn-xoa-chi-phi-khac', function (e) {
    e.preventDefault();
    var $myRow = $(this).parent().parent();

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
        $myRow.remove();
        tinhTongTienChiPhiKhacKhiSuaHopDong();
      }
    });
  });

  $(document).on('change', '#reloaded-table', function (e) {
    console.log(2);
    if ($(this).val() == 1) {
      if (feather) {
        feather.replace({
          width: 14,
          height: 14
        });
      }
      $(this).val(0);
    }
  });

  $(document).on('click', '.thay-doi-trang-thai-hop-dong', function (e) {
    e.preventDefault();
    var $idDanhmuc = $(this).attr('data-value');
    $("#field_hop_dong_cu_trang_thai").val($idDanhmuc);

    $.ajax(
      {
        url: '/load-trang-thai-hop-dong',
        data: {hopDong: $idDanhmuc, token: $("#tokenbody").val()},
        dataType: 'json',
        type: 'post',
        beforeSend: function () {
          blockPage();
          $("#field_trang_thai, #field_ghi_chu").val('');
        },
        success: function (data) {
          $("#token-form-trang-thai-hop-dong").val($("#tokenbody").val());
          for (const key in data.hopDong) {
            $("." + key).text(data.hopDong[key]);
          }
          for (const key in data.khachHang) {
            $("." + key).text(data.khachHang[key]);
          }

          // Hiển thị trạng thái hợp đồng
          var $strTr = '', $stt = 1, $tongTien = 0;
          if (data.listTrangThaiHopDong.length > 0) {
            $.each(data.listTrangThaiHopDong, function (k, obj) {
              $strTr += `<tr>
                            <td>` + $stt + `</td>
                            <td class="text-center">` + obj.created + `</td>
                            <td>` + obj.user + `</td>
                            <td>` + obj.field_trang_thai + `</td>
                        </tr>`;
              $stt++;
            });
            $("#tab-trang-thai-hop-dong table tbody").html($strTr);
          }

          $("#field_trang_thai").val(data.hopDong.field_trang_thai);
          $("#modal-update-trang-thai-hop-dong").modal('show');
        },
        complete: function () {
          unblockPage();
        },
        error: function (r1, r2) {
          getToastError(r1);
          unblockPage();
        }
      }
    )
  });

  $(document).on('click', '.btn-luu-trang-thai-hop-dong', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/luu-trang-thai-hop-dong',
      data: $("#change-trang-thai-hop-dong").serializeArray(),
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockForm($("#change-trang-thai-hop-dong"));
      },
      success: function (data) {
        getToastSuccess(data.content);
        setTimeout(function () {
          $("#views-exposed-form-danh-sach-noi-dung-page-hop-dong #edit-submit-danh-sach-noi-dung").click();
        }, 3000);
      },
      complete: function () {
        unblockPage();
      },
      error: function (r1, r2) {
        getToastError(r1);
      }
    })
  });

  $(document).on('click', '.btn-tim-kiem-hop-dong', function (e) {
    e.preventDefault();
  });

  function convertYMDtoMDY($str, $splash = '/') {
    var arrStr = $str.split('-');
    return arrStr[1] + $splash + arrStr[2] + $splash + arrStr[0];
  }

  $(document).on('change', '#search_nhan_vien_kinh_doanh', function () {
    $("#edit-field-ho-ten-value").val($(this).val());
  });
  $(document).on('change', '#search_ten_khach_hang', function () {
    $("#edit-title").val($(this).val());
  });
  $(document).on('change', '#han_hop_dong_tu', function () {
    $("#edit-field-ket-thuc-hop-dong-value-min-date").val(convertYMDtoMDY($(this).val()));
    if ($("#edit-field-ket-thuc-hop-dong-value-max-date").val() == '') {
      $("#edit-field-ket-thuc-hop-dong-value-max-date").val(convertYMDtoMDY($("#han_hop_dong_den").val()));
    }
  });
  $(document).on('change', '#han_hop_dong_den', function () {
    $("#edit-field-ket-thuc-hop-dong-value-max-date").val(convertYMDtoMDY($(this).val()));
  });
  $(document).on('change', '#email_khach_hang', function () {
    $("#edit-field-email-value").val($(this).val());
  });
  $(document).on('change', '#search_sdt_khach_hang', function () {
    $("#edit-field-dien-thoai-value").val($(this).val());
  });
  $(document).on('change', '#tinh_trang_hop_dong', function () {
    if ($(this).val() == 'Tất cả') {
      $("#edit-field-trang-thai-value").val('All');
    }
    else {
      $("#edit-field-trang-thai-value").val($(this).val());
    }
  });
  $(document).on('change', '#tinh_trang_cong_no', function () {
    if ($(this).val() == 'Tất cả') {
      $("#edit-field-trang-thai-thanh-toan-value").val('All');
    }
    else {
      $("#edit-field-trang-thai-thanh-toan-value").val($(this).val());
    }
  });
  $(document).on('change', '#search_dich_vu', function () {
    $("#edit-field-dich-vu-tid").val($(this).val());
  });

  $(document).on('click', '.btn-tim-kiem-hop-dong', function (e) {
    e.preventDefault();
    $("#views-exposed-form-danh-sach-noi-dung-page-hop-dong #edit-submit-danh-sach-noi-dung").click();
  })

  $(document).on('click', '.btn-khoi-phuc-luoi', function (e) {
    e.preventDefault();
    $("#edit-reset").click();
  });
})
