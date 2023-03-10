$(window).on('load', function () {
  if ($(".text-mau-in").length > 0) {
    $(".brand-text").html('QUẢN LÝ MẪU IN')
  }
  if ($(".text-vai-tro").length > 0) {
    $(".brand-text").html('QUẢN LÝ VAI TRÒ')
  }
  if ($(".text-phan-quyen").length > 0) {
    $(".brand-text").html('QUẢN LÝ PHÂN QUYỀN')
  }
  if ($("#field_ngay_sinh_thanh_lap_khach_hang").length > 0) {
    $("#field_ngay_sinh_thanh_lap_khach_hang").flatpickr();
  }
  if ($("#field_ngay_sinh_thanh_lap_user").length > 0) {
    $("#field_ngay_sinh_thanh_lap_user").flatpickr();
  }
  loadIcon();
  loadDatePicker();
  loadSelect2();
  loadSelect2AjaxHopDong()
  if($("#editor").length>0){
    CKEDITOR.replace('editor');
  }

  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function loadDatePicker() {
    if ($(".flatpickr-basic").length > 0) {
      $('.flatpickr-basic').each(function () {
        $(this).flatpickr({
          static: true,
        })
      })
    }
  }

  function loadIcon() {
    if (feather) {
      feather.replace({
        width: 14,
        height: 14
      });
    }
  }

  function loadSelect2() {
    if ($(".select2").length > 0) {
      $(".select2").each(function () {
        var $this = $(this);
        // $this.wrap('<div class="position-relative"></div>');
        $this.select2({
          // the following code is used to disable x-scrollbar when click in
          // select input and take 100% width in responsive also
          dropdownAutoWidth: true,
          width: '100%',
          dropdownParent: $this.parent()
        }).addClass('select2-done');
      });
    }
  }

  function loadNumerical() {
    if ($(".numeral-mask").length) {
      $(".numeral-mask").each(function () {
        new Cleave(this, {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand'
        });
      })
    }
  }

  function tinhTongTienThuChi() {
    $(".don-gia-so-luong").each(function () {
      var $donGia = $(this).find('.field_so_tien'),
        $soLuong = $(this).find('.field_so_luong'),
        $vat = $(this).parent().parent().find('.vat-tong-tien .field_vat'),
        $blockTongTien = $(this).parent().parent().find('.tong-tien span'),
        $blockThanhTien = $(this).parent().parent().find('.thanh-tien'),
        $tongTien = 0,
        $thanhTien = 0;
      $donGia = ($donGia.val() == '' ? 0 : parseInt($donGia.val().replaceAll(',', '')));
      $soLuong = ($soLuong.val() == '' ? 0 : parseInt($soLuong.val().replaceAll(',', '')));
      $vat = ($vat.val() == '' ? 0 : parseInt($vat.val().replaceAll(',', '')));

      $tongTien = $donGia * $soLuong;
      $thanhTien = $tongTien * (1 + $vat / 100);

      $blockTongTien.text($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}));
      $blockThanhTien.text($thanhTien.toLocaleString('vi', {maximumFractionDigits: 0}));
    })
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

  function loadSelect2AjaxHopDong() {
    if ($(".select2-data-ajax").length > 0) {
      $('.select2-data-ajax').each(function () {
        var $this = $(this);
        if (!$this.hasClass('select2-done')) {
          $this.select2({
            dropdownAutoWidth: true,
            dropdownParent: $this.parent(),
            width: '100%',
            ajax: {
              url: '/get-list-khach-hang',
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
            placeholder: 'Nhập tên khách hàng',
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

  $(document).on('click', '.btn-luu-mau-in', function (e) {
    $.ajax({
      url: '/save-mau-in',
      data: {
        token: $("#tokenbody").val(),
        content: CKEDITOR.instances['editor'].getData()
      },
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockPage();
      },
      success: function (data) {
        getToastSuccess(data.content);
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
  $(document).on('click', '.btn-them-moi-khach-hang', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/get-ma-khach-hang',
      data: {token: $("#tokenbody").val()},
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockPage();
        $("#edit-khach-hang")[0].reset();
        $("#idModel").val('');
        $("#editKhachHang h3").text('Thêm khách hàng');
      },
      success: function (data) {
        $("#field_ma_khach_hang").val(data.content);
        $("#editKhachHang").modal('show');
        loadDate();
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
  $(document).on("click",".dropdown-toggle",function(e){
    e.preventDefault();
    if($(this).parent().find(".dropdown-menu").hasClass("show")){
      $(".dropdown-menu").removeClass("show")
    }
    else {
      $(".dropdown-menu").removeClass("show")
      $(this).parent().find(".dropdown-menu").addClass("show")
    }
  })
  $(document).on('click', '.btn-them-vai-tro', function (e) {
    e.preventDefault();
    $("#form-vai-tro")[0].reset()
    $("#modal-vai-tro").modal('show');
  });
  $(document).on('click', '.btn-sua-vai-tro', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/load-vai-tro',
      data: {
        token: $("#tokenbody").val(),
        roleID: $(this).attr('data-value')
      },
      type: 'post',
      dataType: 'json',
      beforeSend: function () {
        blockPage();
      },
      success: function (data) {
        $("#form-vai-tro")[0].reset()
        $("#title-modal-vai-tro").text("Cập nhật vai trò");
        $("#modal-vai-tro").modal('show');
        $("#modal-vai-tro .name").val(data.name)
        $("#modal-vai-tro #roleID").val(data.roleID)
      },
      error: function (r1, r2) {
        getToastError(r1);
        unblockPage();
      },
      complete: function () {
        unblockPage();
      }
    })
  });
  $(document).on('click', '.btn-xoa-vai-tro', function (e) {
    e.preventDefault();
    e.preventDefault();
    Swal.fire({
      title: 'Xác nhận xóa vai trò',
      text: "Bạn có chắc chắn khi thực hiện thao tác này không !",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận'
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: '/xoa-vai-tro',
          data: {
            token: $("#tokenbody").val(),
            roleID: $(this).attr('data-value'),
          },
          dataType: 'json',
          type: 'post',
          beforeSend: function () {
            blockPage();
          },
          success: function (data) {
            getToastSuccess(data.content);
            window.location = 'vai-tro';
          },
          complete: function () {

            unblockPage();

          },
          error: function (r1, r2) {
            getToastError(r1);
          }
        });
      }
    })

  });
  $(document).on('click', '.btn-save-vai-tro', function (e) {
    e.preventDefault();
    var data = $("#form-vai-tro").serializeArray();
    $.ajax({
      url: '/save-vai-tro',
      data: data,
      type: 'post',
      dataType: 'json',
      beforeSend: function () {
        blockForm($("#form-vai-tro"));
      },
      success: function (data) {
        getToastSuccess(data.content);
        window.location = 'vai-tro';
      },
      error: function (r1, r2) {
        getToastError(r1);
        unblockPage();
      },
      complete: function () {
        unblockPage();
      }
    })
  });
  $(document).on('click', '.btn-luu-phan-quyen', function (e) {
    e.preventDefault();
    var data = $("#idPhanQuyen").serializeArray();
    $.ajax({
      url: '/save-phan-quyen',
      data: data,
      type: 'post',
      dataType: 'json',
      beforeSend: function () {
        blockPage();
      },
      success: function (data) {
        getToastSuccess(data.content);
        // window.location = 'vai-tro';
      },
      error: function (r1, r2) {
        getToastError(r1);
        unblockPage();
      },
      complete: function () {
        unblockPage();
      }
    })
  });

  $(document).on('click', '.btn-pass', function (e) {
    $("#login-password").attr("type","text")
  })
  $(document).on('click', '.btn-luu-khach-hang', function (e) {
    e.preventDefault();
    var data = $("#edit-khach-hang").serializeArray();
    $.ajax({
      url: '/save-khach-hang',
      data: data,
      type: 'post',
      dataType: 'json',
      beforeSend: function () {
        blockForm($("#edit-khach-hang"));
      },
      success: function (data) {
        getToastSuccess(data.content);
        $("#editKhachHang").modal('hide');
        if ($("#edit-submit-danh-sach-noi-dung").length > 0) {
          $("#edit-submit-danh-sach-noi-dung").click();
        }
        else {
          window.location = 'quan-ly-khach-hang';
        }
      },
      error: function (r1, r2) {
        getToastError(r1);
        unblockPage();
      },
      complete: function () {
        unblockPage();
      }
    })
  });
  $(document).on('change', '#field_phan_loai_khach_hang', function () {
    if ($(this).val() == 'Khách hàng cá nhân') {
      $(".kh-doanh-nghiep").addClass('hidden');
    }
    else {
      $(".kh-doanh-nghiep").removeClass('hidden');
    }
  });

  $(document).on('click', '.btn-them-thu-chi', function (e) {
    e.preventDefault();
    $("#modal-thu-chi").modal('show');
  });

  $(document).on('click', '.btn-them-dong-thu-chi', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/get-list-user',
      data: {token: $("#tokenbody").val()},
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockForm($("#form-thu-chi"));
      },
      success: function (data) {
        var $strOptions = '', newId = makeid(10);
        $("#idrandom").val(newId);
        $.each(data.user, function (k, obj) {
          if (obj.uid == $('#user_login').val()) {
            $strOptions += '<option selected value="' + obj.uid + '">' + obj.hoTen + '</option>';
          }
          else {
            $strOptions += '<option value="' + obj.uid + '">' + obj.hoTen + '</option>';
          }
        });
        var dNow = new Date();
        var date = dNow.getFullYear() + '-' + (dNow.getMonth() + 1) + '-' + dNow.getDate();
        var $trNewRow =
          `<tr>
            <td class="td-phan-loai-thu-chi">
                <select name="field_phan_loai[]" class="form-control mb-1 field_phan_loai">
                    <option value="">-- Chọn thu / chi --</option>
                    <option value="Khoản thu">Khoản thu</option>
                    <option value="Khoản chi">Khoản chi</option>
                </select>
                <select name="field_loai_chi_phi[]" class="loai_chi_phi form-control">
                    <option value="">-- Chọn chi phí --</option>
                </select>
                <input type="text" class="hidden form-control new_chi_phi" name="ten_chi_phi[]">
            </td>
            <td class="td-nguoi-ngay-thu-chi">
                <select class="form-control mb-1 field_nguoi_nhap_ref  " name="field_nguoi_nhap_ref[]">
                    <option value="">-- Chọn nhân viên --</option>
                    ` + $strOptions + `
                </select>
                <input type="text" name="field_ngay_nhap[]" class="form-control flatpickr-basic" placeholder="Ngày nhập" value="` + date + `"/>
            </td>
            <td class="td-hop-dong">
                <div class="relative mb-1">
                    <select class="select2-data-ajax form-select" id="select2-ajax-` + newId + `" name="field_hop_dong_cu[]"></select>
                </div>
                <div class="block-thong-tin-hop-dong">
                    <input type="hidden" value="" name="field_hop_dong[]">
                    <p>Còn lại: <span class="tong-tien-con-lai">0</span>/<span class="tong-tien-hop-dong">0</span></p>
                    <p>Cần chi: <span class="tong-tien-can-chi-them text-success">0</span>/<span class="tong-tien-chi">0</span></p>
                </div>
            </td>
            <td class="don-gia-so-luong">
                <input type="text" name="field_so_tien[]" class="form-control field_so_tien numeral-mask text-right mb-1" placeholder="Đơn giá" value="" data-msg="Đơn giá" />
                <input type="text" name="field_so_luong[]" class="form-control hidden field_so_luong numeral-mask text-right" placeholder="Số lượng" value="1" data-msg="Số lượng" />
            </td>
            <td class="vat-tong-tien">
                <div class="mb-1 tong-tien text-right">Tổng tiền: <span>0</span></div>
                <label class="text-right control-label">VAT (%)</label>
                <input type="text" name="field_vat[]" class="form-control field_vat numeral-mask text-right" placeholder="VAT (%)" value="0" data-msg="VAT (%)" />
            </td>
            <td class="thanh-tien text-right font-14">0
            </td>
            <td class="text-center" rowspan="2">
              <a href="#" class="text-danger btn-xoa-dong-thu-chi">
                <i data-feather='trash-2'></i>
              </a>
            </td>
        </tr>
        <tr class="new-row-ghi-chu">
            <td>
              <div class="form-group">
                <input type="text" name="field_hang_muc_hop_dong[]" class="form-control field_hang_muc_hop_dong  mb-1"
                      placeholder="Hạng mục"
                      value=""
                      data-msg="Hạng mục"
                />
              </div>
              <div class="form-group "  >
                  <select class="form-select field_ly_do"  name="field_ly_do[]">

                  </select>
              </div>
              <div class="form-group "  >
                  <select class="form-select field_quy"  name="field_quy[]">

                  </select>
              </div>
            </td>
            <td colspan="2">
                <div class="form-group">
                      <select class="form-select" name="field_hinh_thuc_thanh_toan[]">
                          <option value="">-- Chọn CK / TM --</option>
                          <option value="Chuyển khoản">Chuyển khoản</option>
                          <option value="Tiền mặt">Tiền mặt</option>
                      </select>
                </div>
                <textarea class="form-control" rows="3" name="field_thong_tin_thanh_toan[]" placeholder="Thông tin thanh toán"></textarea>
            </td>
            <td class="td-ghi-chu" colspan="3">
                <textarea class="form-control" rows="5" name="field_ghi_chu[]" placeholder="Ghi chú"></textarea>
            </td>
        </tr>`;
        $("#table-them-thu-chi tbody").append($trNewRow);
        $('.field_ly_do').empty();
        $('.field_ly_do').html('<option value="">-- Chọn lý do --</option>');
        $.each(data.ly_do, function (key, value) {
          $('.field_ly_do').append('<option value="' + value.tid + '">' + value.name + '</option>');
        })
        $(".field_quy").empty()
        $(".field_quy").append(`<option value="">-- Chọn quỹ --</option>`)
        $.each(data.listQuy,function (key,value){
          $(".field_quy").append(`<option value="`+value.nid+`">`+value.name+`</option>`)
        })
      },
      complete: function () {
        loadIcon();
        loadDatePicker();
        loadSelect2Ajax();
        loadNumerical();
        // tinhTongTienThuChi();
        unblockPage();
      },
      error: function (r1, r2) {
        unblockPage();
        getToastError(r1);
      }
    })
  });

  $(document).on('change', '.td-phan-loai-thu-chi .field_phan_loai', function () {
    var $phanLoai = $(this).val(),
      $loaiChiPhiObj = $(this).parent().find('.loai_chi_phi');
    $.ajax({
      url: '/get-term-by-phan-loai-thu-chi',
      data: {token: $("#tokenbody").val(), phanLoai: $phanLoai},
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockForm($("#form-thu-chi"));
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

  $(document).on('change', '.field_so_tien, .field_so_luong, .field_vat', function () {
    // $(".don-gia-so-luong").each(function () {
      var $donGia = $(this).parent().parent().find('.field_so_tien'),
        $soLuong = $(this).parent().parent().find('.field_so_luong'),
        $vat = $(this).parent().parent().find('.vat-tong-tien .field_vat'),
        $blockTongTien = $(this).parent().parent().find('.tong-tien span'),
        $blockThanhTien = $(this).parent().parent().find('.thanh-tien'),
        $tongTien = 0,
        $thanhTien = 0;
      console.log($donGia.val())
      console.log($soLuong.val())
      console.log($vat.val())
      $donGia = ($donGia.val() == '' ? 0 : parseInt($donGia.val().replaceAll(',', '')));
      $soLuong = ($soLuong.val() == '' ? 0 : parseInt($soLuong.val().replaceAll(',', '')));
      $vat = ($vat.val() == '' ? 0 : parseInt($vat.val().replaceAll(',', '')));

      $tongTien = $donGia * $soLuong;
      $thanhTien = $tongTien * (1 + $vat / 100);

      $blockTongTien.text($tongTien.toLocaleString('vi', {maximumFractionDigits: 0}));
      $blockThanhTien.text($thanhTien.toLocaleString('vi', {maximumFractionDigits: 0}));
    // })
  });

  $(document).on('click', '.btn-xoa-dong-thu-chi', function (e) {
    e.preventDefault();
    var $thisRow = $(this).parent().parent(),
      $ghiChuRow = $(this).parent().parent().next();
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
        $thisRow.remove();
        $ghiChuRow.remove();
      }
    });
  });

  $(document).on('click', '.btn-save-thu-chi', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/luu-thu-chi',
      data: $("#form-thu-chi").serializeArray(),
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        blockForm($("#form-thu-chi"));
      },
      success: function (data) {
        getToastSuccess(data.content);
        if ($("#table-thu-chi").length == 0) {
          $("#modal-thu-chi").modal("hide")
          window.location = 'thu-chi';
        }
        else {
          setTimeout(function () {
            $("#views-exposed-form-danh-sach-noi-dung-page-thu-chi #edit-submit-danh-sach-noi-dung").click();
          }, 3000);
        }
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

  $(document).on('change', '.td-hop-dong select', function () {
    var idHopDong = $(this).val(),
      tongTienHopDong = $(this).parent().parent().find('p .tong-tien-hop-dong'),
      tongTienCanChiThem = $(this).parent().parent().find('p .tong-tien-can-chi-them'),
      tongTienChi = $(this).parent().parent().find('p .tong-tien-chi'),
      tongTienConLai = $(this).parent().parent().find('p .tong-tien-con-lai');

    $(this).parent().parent().find('.block-thong-tin-hop-dong input').val(idHopDong);
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
        tongTienConLai.text(data.hopDong.con_lai_chua_thanh_toan);
        tongTienCanChiThem.text(data.hopDong.can_chi_them);
        tongTienChi.text(data.hopDong.field_tong_chi_hop_dong);
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
})

function loadDate() {
  if ($(".flatpickr-basic").length > 0) {
    $('.flatpickr-basic').each(function () {
      $(this).flatpickr(
        {
          static: true,
        }
      )
    })
  }
}
