$(document).ready(function () {
  $(".brand-text").html('QUẢN LÝ DỮ LIỆU THU CHI')
  function resetForm() {
    $("#views-exposed-form-danh-sach-noi-dung-page-thu-chi #edit-submit-danh-sach-noi-dung").click();
  }

  function loadSelect2Ajax() {
    if ($(".select2-data-ajax").length > 0) {
      $('.select2-data-ajax').each(function () {
        var $this = $(this);
        if (!$this.hasClass('select2-done')) {
          $this.select2({
            dropdownAutoWidth: true,
            dropdownParent: $this.parent(),
            width: '100%',
            ajax: {
              url: '/get-hop-dong-by-ma-hop-dong',
              dataType: 'json',
              delay: 250,
              type: 'post',
              data: function (params) {
                return {
                  q: params.term,
                  token: $("#tokenbody").val(),// search term
                  page: params.page
                };
              },
              processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not
                // need to alter the remote JSON data, except to indicate that
                // infinite scrolling can be used
                params.page = params.page || 1;

                return {
                  results: data.items,
                  pagination: {
                    more: params.page * 30 < data.total_count
                  }
                };
              },
              cache: true
            },
            placeholder: 'Nhập mã hợp đồng',
            escapeMarkup: function (markup) {
              return markup;
            }, // let our custom formatter work
            minimumInputLength: 2,
            templateResult: formatRepo,
            templateSelection: formatRepoSelection
          }).addClass('select2-done');
        }
      })
    }
  }

  function formatRepo(repo) {
    if (repo.loading) {
      return repo.text;
    }
    var markup =
      "<div class='select2-result-repository clearfix'><div class='select2-result-repository__title'>" + repo.name + '</div></div>';
    //   "<div class='select2-result-repository__avatar'><img src='" +
    //   repo.owner.avatar_url +
    //   "' /></div>" +
    //   "<div class='select2-result-repository__meta'>" +
    //   "<div class='select2-result-repository__title'>" +
    //   repo.full_name +
    //   '</div>';
    //
    // if (repo.description) {
    //   markup += "<div class='select2-result-repository__description'>" +
    // repo.description + '</div>'; }  markup += "<div
    // class='select2-result-repository__statistics'>" + "<div
    // class='select2-result-repository__forks'>" +
    // feather.icons['share-2'].toSvg({ class: 'me-50' }) + repo.forks_count +
    // ' Forks</div>' + "<div class='select2-result-repository__stargazers'>" +
    // feather.icons['star'].toSvg({ class: 'me-50' }) + repo.stargazers_count
    // + ' Stars</div>' + "<div class='select2-result-repository__watchers'>" +
    // feather.icons['eye'].toSvg({ class: 'me-50' }) + repo.watchers_count + '
    // Watchers</div>' + '</div>' + '</div></div>';
    return markup;
  }

  function formatRepoSelection(repo) {
    console.log(repo);
    return repo.name || repo.text;
  }

  function convertYMDtoMDY($str, $splash = '/') {
    var arrStr = $str.split('-');
    return arrStr[1] + $splash + arrStr[2] + $splash + arrStr[0];
  }

  $(document).on('click', '.xoa-thu-chi', function (e) {
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
          url: '/xoa-thu-chi',
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
  $(document).on('click', '.xem-chi-tiet-thu-chi', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/load-chi-phi',
      data: {id: $(this).attr('data-value'), token: $("#tokenbody").val()},
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockPage();
      },
      success: function (data) {
        $('#modal-xem-thu-chi').modal('show');
        if (data.field_phan_loai == "Thu") {
          $("#myModalLabel1").text('Thông tin tiết phiếu thu');
        }
        else {
          $("#myModalLabel1").text('Thông tin tiết phiếu chi');
        }
        $.each(data, function (key, value) {
          if(value=='Thu'){
            value="Phiếu thu"
          }
          else if (value=="Chi") {
            value="Phiếu chi"
          }
          else if(value=="Đã duyệt"){
            value = " <span class='text-success'><i data-feather='check-circle'></i> Đã duyệt</span>"
          }
          else if(value=="Chờ duyệt"){
            value = "<span class='text-warning'> <i data-feather='refresh-cw'></i> Chờ duyệt</span>"
          }
          else if(value=="Huỷ"){
            value = "<span class='text-danger'><i data-feather='refresh-cw'></i> Hủy</span>"
          }
          if(key==='field_trang_thai_thu_chi'){
            $('#' + key).html(value)
            if (feather) {
              feather.replace({
                width: 14,
                height: 14
              });
            }
          }else
            $('#' + key).text(value)
        })
      },
      complete: function () {
        unblockPage();
      },
      error: function (r1, r2) {
        getToastError(r1);
      }
    })
  });
  $(document).on('click', '.btn-update-thu-chi', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/update-thu-chi',
      data: $('#form-update-thu-chi').serializeArray(),
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockForm($("#form-thu-chi"));
      },
      success: function (data) {
        getToastSuccess(data.content);
        resetForm()
      },
      complete: function () {
        unblockPage();
      },
      error: function (r1, r2) {
        getToastError(r1);
      }
    })
  });
  $(document).on('click', '.sua-thu-chi', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/load-update-thu-chi',
      data: {id: $(this).attr('data-value'), token: $("#tokenbody").val()},
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockPage();
      },
      success: function (data) {
        $('#modal-sua-thu-chi').modal('show');
        $('#tong_tien_con_lai_tc').text(data.tong_tien_con_lai_tc)
        $('#tong_tien_hop_dong').text(data.tong_tien_hop_dong)
        $('#field_tong_tien_tc').text(data.field_tong_tien_tc+" VNĐ")
        $('#field_thanh_tien_tc').text(data.field_thanh_tien_tc +" VNĐ")
        $('#field_ma_hop_dong_tc').append('<option value="' + data.field_ma_hop_dong_tc + '">' + data.title_hop_dong + '</option>');
        $('#field_loai_chi_phi_tc').empty();
        $('#field_loai_chi_phi_tc').append('<option value="">-- Chọn loại chi phí --</option>');
        $.each(data.list_loai_chi_phi, function (key, value) {
          $('#field_loai_chi_phi_tc').append('<option value="' + value.tid + '">' + value.name + '</option>');
        })
        $("#field_quy_tc").empty()
        $("#field_quy_tc").append(`<option value="">-- Chọn quỹ --</option>`)
        $.each(data.listQuy,function (key,value){
          $("#field_quy_tc").append(`<option value="`+value.nid+`">`+value.name+`</option>`)
        })
        $('#field_ly_do_tc').empty();
        $('#field_ly_do_tc').append('<option value="">-- Chọn lý do --</option>');
        $.each(data.list_ly_do, function (key, value) {
          $('#field_ly_do_tc').append('<option value="' + value.tid + '">' + value.name + '</option>');
        })
        $('#field_nguoi_nhap_ref_tc').empty();
        $('#field_nguoi_nhap_ref_tc').append('<option value="">-- Chọn NV --</option>');
        $.each(data.list_user, function (key, value) {
          $('#field_nguoi_nhap_ref_tc').append('<option value="' + value.uid + '">' + value.name + '</option>');
        })
        $.each(data, function (key, value) {
          $('#' + key).val(value)
        })
        $('#field_phan_loai_tc').val(data.field_phan_loai_tc === 'Thu' ? 'Khoản thu' : 'Khoản chi')
        if ($(".numeral-mask").length) {
          $(".numeral-mask").each(function () {
            new Cleave(this, {
              numeral: true,
              numeralThousandsGroupStyle: 'thousand'
            });
          })
        }
      },
      complete: function () {
        unblockPage();
        loadSelect2Ajax()
      },
      error: function (r1, r2) {
        getToastError(r1);
      }
    })
  });
  $(document).on('change','#field_don_gia_dich_vu_tc,#field_so_luong_tc,#field_vat_tc ',function (){
    var tongTien= $("#field_tong_tien_tc").val();
    var thanhTien= $("#field_thanh_tien_tc").val();
    if(
      $('#field_don_gia_dich_vu_tc').val()!=''&&
      $('#field_so_luong_tc').val()!=''&&
      $('#field_vat_tc').val()!=''
    ){
      var donGia = parseInt($('#field_don_gia_dich_vu_tc').val().replaceAll(',', ''))
      var vat = parseInt($('#field_vat_tc').val())
      var sl = parseInt($('#field_so_luong_tc').val())
      tongTien=donGia*sl;
      thanhTien=tongTien + tongTien*vat/100;
      $("#field_tong_tien_tc").text((parseInt(tongTien)).toLocaleString('vi', {maximumFractionDigits: 0})+" VNĐ")
      $("#field_thanh_tien_tc").text((parseInt(thanhTien)).toLocaleString('vi', {maximumFractionDigits: 0}) + " VNĐ");
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
  $(document).on('click', '.in-phieu-thu', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/load-mau-in',
      data: {id: $(this).attr('data-value'), token: $("#tokenbody").val()},
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockPage();
      },
      success: function (data) {
        $(".print-block").html('<style> @page { size:  landscape;}</style>');
        $(".print-block").append(data).printArea();
      },
      complete: function () {
        unblockPage();
      },
      error: function (r1, r2) {
        getToastError(r1);
      }
    })
    $("#modal-xem-thu-chi").printArea();
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
          $("#modal-xem-hop-dong #tab-lich-su-thanh-toan table tbody, #tab-chi-phi table tbody, #tab-trang-thai-hop-dong table tbody, #tab-lich-su-chi table tbody").html('');
        },
        success: function (data) {
          for (const key in data.hopDong) {
            $("#modal-xem-hop-dong ." + key).text(data.hopDong[key]);
          }
          for (const key in data.khachHang) {
            $("#modal-xem-hop-dong ." + key).text(data.khachHang[key]);
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
            $("#modal-xem-hop-dong #tab-lich-su-thanh-toan table tbody").html($strTr);
            $("#modal-xem-hop-dong #tong-tien-da-thu-view").html($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}))
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
            $("#modal-xem-hop-dong #tab-chi-phi table tbody").html($strTr);
            $("#modal-xem-hop-dong #tab-chi-phi table tfoot .tong-tien-chi-phi-khac").html($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}))
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
            $("#modal-xem-hop-dong #tab-lich-su-chi table tbody").html($strTr);
            $("#modal-xem-hop-dong #tong-tien-da-chi").html($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}))
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
            $("#modal-xem-hop-dong #tab-trang-thai-hop-dong table tbody").html($strTr);
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
  $(document).on('click', '.xem-chi-tiet-khach-hang', function (e){
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

  $(document).on('change', '#field_phan_loai_tc', function () {
    var $phanLoai = $(this).val(),
      $loaiChiPhiObj = $('#field_loai_chi_phi_tc');
    $.ajax({
      url: '/get-term-by-phan-loai-thu-chi',
      data: {token: $("#tokenbody").val(), phanLoai: $phanLoai},
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockForm($("#form-update-thu-chi"));
        $loaiChiPhiObj.html('<option value="">-- Chọn chi phí --</option>');
      },
      success: function (data) {
        $.each(data, function (k, obj) {
          $loaiChiPhiObj.append('<option value="' + obj.tid + '">' + obj.name + '</option>');
        })
      },
      complete: function () {
        unblockPage();
      },
      error: function (r1, r2) {
        unblockPage();
        getToastError(r1);
      }
    })
  });

  $(document).on('change', '#field_ma_hop_dong_tc', function () {
    var idHopDong = $(this).val(),
      tongTienHopDong = $("#tong_tien_hop_dong"),
      // tongTienDaThu = $(this).parent().parent().find('p .tong-tien-da-thu'),
      tongTienConLai = $("#tong_tien_con_lai_tc");

    // $(this).parent().parent().find('.block-thong-tin-hop-dong input').val(idHopDong);
    $.ajax({
      url: '/xem-chi-tiet-hop-dong',
      data: {hopDong: idHopDong, token: $("#tokenbody").val()},
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockForm($("#form-thu-chi"));
      },
      success: function (data) {
        tongTienHopDong.text(data.hopDong.field_tong_tien);
        // tongTienDaThu.text(data.hopDong.field_so_tien_da_thanh_toan);
        tongTienConLai.text(data.hopDong.con_lai_chua_thanh_toan);
      },
      complete: function () {
        unblockPage();
      },
      error: function (r1, r2) {
        unblockPage();
        getToastError(r1);
      }
    })
  })

  $(document).on('change', '#title', function () {
    $('#edit-title').val($(this).val())
  })
  $(document).on('change', '#field_hinh_thuc_thanh_toan_value_search', function () {
    $("#edit-field-hinh-thuc-thanh-toan-value").val($(this).val());
  })
  $(document).on('change', '#field_trang_thai_thu_chi_value_search', function () {
    $("#edit-field-trang-thai-thu-chi-value").val($(this).val());
  })
  $(document).on('change', '#field_phan_loai_value_search', function () {
    $("#edit-field-phan-loai-value").val($(this).val());
  })
  $(document).on('change', '#title_1', function () {
    $('#edit-title-1').val($(this).val())
  })
  $(document).on('change', '#field_ho_ten_value', function () {
    $('#edit-field-ho-ten-value').val($(this).val())
  })
  $(document).on('click', '.btn-tim-kiem-thu-chi', function (e) {
    e.preventDefault();
    $("#views-exposed-form-danh-sach-noi-dung-page-thu-chi #edit-submit-danh-sach-noi-dung").click();
  })
  $(document).on('click', '.btn-khoi-phuc-luoi', function (e) {
    e.preventDefault();
    $("#edit-reset").click();
  });
  $(document).on('change', '#field_ngay_nhap_value', function () {
    $("#edit-field-ngay-nhap-value-min-date").val(convertYMDtoMDY($(this).val()));
    if ($("#edit-field-ngay-nhap-value-max-date").val() == '') {
      $("#edit-field-ngay-nhap-value-max-date").val(convertYMDtoMDY($("#field_ngay_nhap_value_1").val()));
    }
  });
  $(document).on('change', '#field_ngay_nhap_value_1', function () {
    $("#edit-field-ngay-nhap-value-max-date").val(convertYMDtoMDY($(this).val()));
  });
})
